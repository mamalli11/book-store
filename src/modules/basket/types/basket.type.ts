export type BookItemsInBasket = {
	bookId: number;
	name: string;
	description?: string;
	count: number;
	image?: string;
	price: number;
	total_amount: number;
	discount_amount: number;
	payment_amount: number;
	discountCode?: string;
};

export type BasketType = {
	total_amount: number;
	payment_amount: number;
	total_discount_amount: number;
	bookList: BookItemsInBasket[];
	generalDiscountDetail: any;
};
