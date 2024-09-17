import {
	Injectable,
	ConflictException,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DiscountEntity } from "./entities/discount.entity";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class DiscountService {
	constructor(
		@InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
	) {}

	async create(createDiscountDto: CreateDiscountDto) {
		const { amount, code, expires_in, limit, percent, start_at, type } = createDiscountDto;
		await this.checkExistCode(code);

		const discountObject: DeepPartial<DiscountEntity> = { code };
		if ((!amount && !percent) || (amount && percent)) {
			throw new BadRequestException("You must enter one of the amount or percent fields ");
		}
		if (amount && !isNaN(parseFloat(amount.toString()))) {
			discountObject["amount"] = amount;
		} else if (percent && !isNaN(parseFloat(percent.toString()))) {
			discountObject["percent"] = percent;
		}

		if (expires_in && !isNaN(parseInt(expires_in.toString()))) {
			const time = 1000 * 60 * 60 * 24 * expires_in;
			discountObject["expires_in"] = new Date(new Date().getTime() + time);
		}
		if (limit && !isNaN(parseInt(limit.toString()))) {
			discountObject["limit"] = limit;
		}

		const discount = this.discountRepository.create({
			...discountObject,
			start_at,
			type,
		});
		await this.discountRepository.save(discount);
		return { message: PublicMessage.CreatedDiscount };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [discount, count] = await this.discountRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return {
			pagination: paginationGenerator(count, page, limit),
			discount,
		};
	}

	async findOne(id: number) {
		const discount = await this.discountRepository.findOneBy({ id });
		if (!discount) throw new NotFoundException(NotFoundMessage.NotFoundDiscount);
		return discount;
	}

	async delete(id: number) {
		await this.findOne(id);
		await this.discountRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}

	async checkExistCode(code: string) {
		const discount = await this.discountRepository.findOneBy({ code });
		if (discount) throw new ConflictException("already exist code");
	}

	async findOneByCode(code: string) {
		const discount = await this.discountRepository.findOneBy({ code });
		if (!discount) throw new NotFoundException("not found discount code");
		return discount;
	}

	async useDiscount(code: string) {
		const discount = await this.findOneByCode(code);
		if (!discount.active) throw new BadRequestException("not active discount");

		discount.usage += 1;
		if (discount.limit !== null && discount.usage >= discount.limit) {
			discount.active = false;
		}
		await this.discountRepository.save(discount);
		return discount;
	}
}
