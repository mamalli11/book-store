import * as path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";

import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { BooksModule } from "../books/books.module";
import { OrderModule } from "../order/order.module";
import { HttpApiModule } from "../http/http.module";
import { EditorModule } from "../editor/editor.module";
import { WriterModule } from "../writer/writer.module";
import { BasketModule } from "../basket/basket.module";
import { SearchModule } from "../search/search.module";
import { PaymentModule } from "../payment/payment.module";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { CategoryModule } from "../category/category.module";
import { DiscountModule } from "../discount/discount.module";
import { CommentsModule } from "../comments/comments.module";
import { PublisherModule } from "../publisher/publisher.module";
import { TranslatorModule } from "../translator/translator.module";
import { TagsModule } from "../tags/tags.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: path.join(process.cwd(), ".env"),
		}),
		TypeOrmModule.forRoot(TypeOrmConfig()),
		I18nModule.forRoot({
			fallbackLanguage: "en",
			loaderOptions: {
				path: path.join(process.cwd(), "/src/common/i18n"),
				watch: true,
			},
			resolvers: [
				new HeaderResolver(["x-custom-lang"]),
				new QueryResolver(["lang"]),
				new AcceptLanguageResolver(),
			],
		}),
		AuthModule,
		UserModule,
		TagsModule,
		OrderModule,
		BooksModule,
		SearchModule,
		WriterModule,
		EditorModule,
		BasketModule,
		HttpApiModule,
		PaymentModule,
		CategoryModule,
		DiscountModule,
		CommentsModule,
		PublisherModule,
		TranslatorModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
