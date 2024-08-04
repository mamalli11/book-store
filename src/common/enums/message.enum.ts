export enum BadRequestMessage {
	NotOwnerComment = "شما صاحب این نظر نیستید",
	SomeThingWrong = "خطایی پیش آمده مجددا تلاش کنید",
	AlreadyRejected = "نظر انتخاب شده قبلا رد شده است",
	AlreadyAccepted = "نظر انتخاب شده قبلا تایید شده است",
	InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمیباشد",
	InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمیباشد",
}
export enum AuthMessage {
	TryAgain = "دوباره تلاش کنید",
	NotFoundAccount = "حساب کاربری یافت نشد",
	LogoutSuccessfully="خروج موفقیت آمیز بود",
	ExpiredToken = "توکن منقصی شده تلاش نکنید.",
	LoginAgain = "مجددا وارد حساب کاربری خود شوید",
	LoginIsRequired = "وارد حساب کاربری خود شوید",
	DeleteAccount = "حساب کاربری باموفقیت حذف شد",
	Forbidden = "شما دسترسی لازم برای این عملیات را ندارید",
	ExpiredCode = "کد تایید منقصی شده مجددا تلاش کنید.",
	AlreadyExistAccount = "حساب کاربری با این مشخصات قبلا وجود دارد",
}
export enum NotFoundMessage {
	NotFound = "موردی یافت نشد",
	NotFoundBook = "کتاب یافت نشد",
	NotFoundUser = "کاربری یافت نشد",
	NotFoundWriter = "نویسنده یافت نشد",
	NotFoundEditor = "ویرایشگر یافت نشد",
	NotFoundPublisher = "ناشر یافت نشد",
	NotFoundTranslator = "مترجم یافت نشد",
	NotFoundCategory = "دسته بندی یافت نشد",
	NotFoundDiscount = "کد تخفیف یافت نشد",
}
export enum ValidationMessage {
	InvalidEmailFormat = "ایمیل وارد شده صحیح نمیباشد",
	InvalidPhoneFormat = "شماره موبایل وارد شده صحیح نمیباشد",
	InvalidWorkPhoneFormat = "شماره ثابت وارد شده صحیح نمیباشد",
	InvalidImageFormat = "فرمت تصریر انتخاب شده باید ار نوع jpg و png باشد",
}
export enum PublicMessage {
	Created = "با موفقیت ایجاد شد",
	Deleted = "با موفقیت حذف شد",
	Inserted = "با موفقیت درج شد",
	Updated = "با موفقیت به روز رسانی شد",

	Nothing = "هیچ کاری انجام نشد",
	Successfuly = "درخواست باموفقیت انجام شد",
	SentOtp = "کد یکبار مصرف با موفقیت ارسال شد",
	LoggedIn = "با موفقیت وارد حساب کاربری خود شدید",
	
	Bookmark = "کتاب با موفقیت ذخیره شد",
	LikeComment = "کامنت با موفقیت لایک شد",
	CreatedWriter = "نویسنده باموفقیت ایجاد شد",
	CreatedPublisher = "ناشر باموفقیت ایجاد شد",
	CreatedTranslator = "مترجم باموفقیت ایجاد شد",
	CreatedComment = " نظر شما با موفقیت ثبت شد",
	CreatedDiscount = "کد تخفیف با موفقیت ایجاد شد",
	DisLikeComment = "لایک شما از کامنت برداشته شد",
	CreatedCategory = "دسته بندی باموفقیت ایجاد شد",
	UnBookmark = " کتاب از لیست کتاب ها ذخیره شده برداشته شد",
}
export enum ConflictMessage {
	Email = "ایمیل توسط شخص دیگری استفاده شده",
	Phone = "موبایل توسط شخص دیگری استفاده شده",
	Username = "تام کاربری توسط شخص دیگری استفاده شده",
	CategoryTitle = "عنوان دسته بندی قبلا ثبت شده است",
	CategorySlug = "slug دسته بندی قبلا ثبت شده است",
}
