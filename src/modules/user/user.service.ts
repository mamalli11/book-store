import {
	Scope,
	Inject,
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
} from "@nestjs/common";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { isDate } from "class-validator";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import {
	AuthMessage,
	PublicMessage,
	ConflictMessage,
	NotFoundMessage,
	BadRequestMessage,
} from "src/common/enums/message.enum";
import { S3Service } from "../s3/s3.service";
import { UpdateUserDto } from "./dto/profile.dto";
import { GenderType } from "./enums/profile.enum";
import { OtpEntity } from "./entities/otp.entity";
import { AuthService } from "../auth/auth.service";
import { UserEntity } from "./entities/user.entity";
import { TokenService } from "../auth/tokens.service";
import { AuthMethod } from "../auth/enums/method.enum";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { ProfileEntity } from "./entities/profile.entity";
import { EntityName } from "src/common/enums/entity.enum";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
	constructor(
		@InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
		@Inject(REQUEST) private request: Request,
		private authService: AuthService,
		private tokenService: TokenService,
		private s3Service: S3Service,
	) {}

	profile() {
		const { id } = this.request.user;
		return this.userRepository
			.createQueryBuilder(EntityName.User)
			.where({ id })
			.leftJoinAndSelect("user.profile", "profile")
			.getOne();
	}

	async updateInfo(updateUserDto: UpdateUserDto, file: Express.Multer.File) {
		const { id: userId, profileId } = this.request.user;
		let profile = await this.profileRepository.findOneBy({ userId });

		const profileUpdateObject: DeepPartial<ProfileEntity> = {};

		if (file) {
			const { Location, Key } = await this.s3Service.uploadFile(file, "user");
			if (Location) {
				profileUpdateObject["profile_picture"] = Location;
				profileUpdateObject["imageKey"] = Key;
				if (profile?.imageKey) await this.s3Service.deleteFile(profile?.imageKey);
			}
		}

		const { bio, birthday, gender, fname, lname, country, language } = updateUserDto;

		if (profile) {
			if (bio) profileUpdateObject["bio"] = bio;
			if (fname) profileUpdateObject["fname"] = fname;
			if (lname) profileUpdateObject["lname"] = lname;
			if (country) profileUpdateObject["country"] = country;
			if (language) profileUpdateObject["language"] = language;
			if (gender && Object.values(GenderType as any).includes(gender))
				profileUpdateObject["gender"] = gender;
			if (birthday && isDate(new Date(birthday)))
				profileUpdateObject["birthday"] = new Date(birthday);

			await this.profileRepository.update({ id: profileId }, profileUpdateObject);
		}

		if (!profileId) await this.userRepository.update({ id: userId }, { profileId: profile.id });

		return { message: PublicMessage.Updated };
	}
	async removeAccount() {
		const { id } = this.request.user;
		await this.userRepository.delete({ id });
		await this.profileRepository.delete({ userId: id });
		await this.otpRepository.delete({ userId: id });
		return { message: AuthMessage.DeleteAccount };
	}
	async changeEmail(email: string) {
		const { id } = this.request.user;
		const user = await this.userRepository.findOneBy({ email });
		if (user && user?.id !== id) {
			throw new ConflictException(ConflictMessage.Email);
		} else if (user && user.id == id) {
			return { message: PublicMessage.Updated };
		}

		await this.userRepository.update({ id }, { new_email: email });
		const otp = await this.authService.saveOtp(id, AuthMethod.Email);
		const token = this.tokenService.createEmailToken({ email });
		return { code: otp.code, token };
	}
	async verifyEmail(code: string) {
		const { id: userId, new_email } = this.request.user;
		const token = this.request.cookies?.[CookieKeys.EmailOTP];
		if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
		const { email } = this.tokenService.verifyEmailToken(token);
		if (email !== new_email) throw new BadRequestException(BadRequestMessage.SomeThingWrong);

		const otp = await this.checkOtp(userId, code);
		if (otp.method !== AuthMethod.Email)
			throw new BadRequestException(BadRequestMessage.SomeThingWrong);

		await this.userRepository.update(
			{ id: userId },
			{ email, verify_email: true, new_email: null },
		);
		return { message: PublicMessage.Updated };
	}
	async changePhone(phone: string) {
		const { id } = this.request.user;
		const user = await this.userRepository.findOneBy({ phone });
		if (user && user?.id !== id) {
			throw new ConflictException(ConflictMessage.Phone);
		} else if (user && user.id == id) {
			return { message: PublicMessage.Updated };
		}

		await this.userRepository.update({ id }, { new_phone: phone });
		const otp = await this.authService.saveOtp(id, AuthMethod.Phone);
		const token = this.tokenService.createPhoneToken({ phone });
		return { code: otp.code, token };
	}
	async verifyPhone(code: string) {
		const { id: userId, new_phone } = this.request.user;
		const token = this.request.cookies?.[CookieKeys.PhoneOTP];
		if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
		const { phone } = this.tokenService.verifyPhoneToken(token);
		if (phone !== new_phone) throw new BadRequestException(BadRequestMessage.SomeThingWrong);

		const otp = await this.checkOtp(userId, code);
		if (otp.method !== AuthMethod.Phone)
			throw new BadRequestException(BadRequestMessage.SomeThingWrong);

		await this.userRepository.update(
			{ id: userId },
			{ phone, verify_phone: true, new_phone: null },
		);
		return { message: PublicMessage.Updated };
	}
	async checkOtp(userId: number, code: string) {
		const otp = await this.otpRepository.findOneBy({ userId });
		if (!otp) throw new BadRequestException(NotFoundMessage.NotFound);
		const now = new Date();
		if (otp.expiresIn < now) throw new BadRequestException(AuthMessage.ExpiredCode);
		if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);
		return otp;
	}
	async userProfile(userId: number) {
		const { id } = this.request.user;
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) throw new NotFoundException(NotFoundMessage.NotFoundUser);

		return this.userRepository.find({
			where: { id: user.id },
			relations: {
				profile: true,
			},
			select: {
				profile: { fname: true, lname: true, profile_picture: true, bio: true },
				id: true,
				is_verified: true,
				created_at: true,
			},
		});
	}
}
