const { Router } = require("express");

// Route imports - organized alphabetically
const AuthRouter = require("./routes/auth.route.js");
const RoleRouter = require("./routes/role.route.js");
const BannerRouter = require("./routes/banner.route.js");
const BrandRouter = require("./routes/brand.route.js");
const CampaignRouter = require("./routes/campaign.route.js");
const CartRouter = require("./routes/cart.route.js");
const CategoryRouter = require("./routes/category.route.js");
const CloudinaryRouter = require("./routes/cloudinary.route.js");
const ChildCategoryRouter = require("./routes/childCategory.route.js");
const ContactRouter = require("./routes/contactInfo.route.js");
const CouponRouter = require("./routes/coupon.route.js");
const InventoryRouter = require("./routes/inventory.route.js");
const OrderRouter = require("./routes/order.route.js");
const PaymentRouter = require("./routes/payment.route.js");
const PaymentServiceConfigRouter = require("./routes/paymentServiceConfig.route.js");
const ProductRouter = require("./routes/product.route.js");
const ProductReviewRouter = require("./routes/productReview.route.js");
const ReportRouter = require("./routes/report.route.js");
const SubCategoryRouter = require("./routes/subCategory.route.js");
const UserRouter = require("./routes/user.route.js");

const rootRouter = Router();

// Route definitions - organized alphabetically
rootRouter.use("/auth", AuthRouter);
rootRouter.use("/role", RoleRouter);
rootRouter.use("/banners", BannerRouter);
rootRouter.use("/brand", BrandRouter);
rootRouter.use("/campaign", CampaignRouter);
rootRouter.use("/cart", CartRouter);
rootRouter.use("/category", CategoryRouter);
rootRouter.use("/cloudinary", CloudinaryRouter);
rootRouter.use("/child-category", ChildCategoryRouter);
rootRouter.use("/contact-info", ContactRouter);
rootRouter.use("/coupon", CouponRouter);
rootRouter.use("/inventory", InventoryRouter);
rootRouter.use("/order", OrderRouter);
rootRouter.use("/payment", PaymentRouter);
rootRouter.use("/payment-service-config", PaymentServiceConfigRouter);
rootRouter.use("/product", ProductRouter);
rootRouter.use("/product-review", ProductReviewRouter);
rootRouter.use("/report", ReportRouter);
rootRouter.use("/sub-category", SubCategoryRouter);
rootRouter.use("/user", UserRouter);

module.exports = rootRouter;
