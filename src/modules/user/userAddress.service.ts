import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";

import { UserAddressEntity } from "./entities/address.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { CreateUserAddressDto, UpdateUserAddressDto } from "./dto/userAddress.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class UserAddressService {
	constructor(
		@InjectRepository(UserAddressEntity)
		private userAddressRepository: Repository<UserAddressEntity>,
		@Inject(REQUEST) private request: Request,
	) {}

	async create(createUserAddressDto: CreateUserAddressDto) {
		const { id } = this.request.user;

		await this.userAddressRepository.insert({ ...createUserAddressDto, userId: id });
		return { message: PublicMessage.CreatedAddress };
	}

	async findAll(paginationDto: PaginationDto) {
		const { id } = this.request.user;
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [addressList, count] = await this.userAddressRepository.findAndCount({
			where: { userId: id },
			skip,
			take: limit,
		});

		return { pagination: paginationGenerator(count, page, limit), addressList };
	}

	async findOne(id: number) {
		const { id: userId } = this.request.user;
		const userAddr = await this.userAddressRepository.findOne({
			where: { userId, id },
		});
		if (!userAddr) throw new NotFoundException(NotFoundMessage.NotFoundAddress);
		return userAddr;
	}

	async update(id: number, updateUserAddressDto: UpdateUserAddressDto) {
		const { id: userId } = this.request.user;
		await this.findOne(id);
		const updateObject: DeepPartial<UserAddressEntity> = {};

		const { title, province, city, address, postal_code } = updateUserAddressDto;

		if (title) updateObject["title"] = title;
		if (province) updateObject["province"] = province;
		if (city) updateObject["city"] = city;
		if (address) updateObject["address"] = address;
		if (postal_code) updateObject["postal_code"] = postal_code;

		await this.userAddressRepository.update({ id, userId }, updateObject);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		const { id: userId } = this.request.user;
		await this.findOne(id);
		await this.userAddressRepository.delete({ userId, id });
		return { message: PublicMessage.Deleted };
	}
}
