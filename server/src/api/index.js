const { Router } = require("express");

// Route imports - organized alphabetically
const AboutUsRouter = require("./routes/aboutUs.route.js");
const AuthRouter = require("./routes/auth.route.js");
const BannerRouter = require("./routes/banner.route.js");
const BrandRouter = require("./routes/brand.route.js");
const CampaignRouter = require("./routes/campaign.route.js");
const CartRouter = require("./routes/cart.route.js");
const CategoryRouter = require("./routes/category.route.js");
const ChildCategoryRouter = require("./routes/childCategory.route.js");
const ContactRouter = require("./routes/contactInfo.route.js");
const CouponRouter = require("./routes/coupon.route.js");
const InventoryRouter = require("./routes/inventory.route.js");
const NewsletterRouter = require("./routes/newsletter.route.js");
const OrderRouter = require("./routes/order.route.js");
const OrderBulkRouter = require("./routes/order.bulk.route.js");
const PaymentRouter = require("./routes/payment.route.js");
const PaymentServiceConfigRouter = require("./routes/paymentServiceConfig.route.js");
const PolicyRouter = require("./routes/policy.route.js");
const ProductRouter = require("./routes/product.route.js");
const ProductReviewRouter = require("./routes/productReview.route.js");
const ReportRouter = require("./routes/report.route.js");
const RoleRouter = require("./routes/role.route.js");
const ShippingMethodRouter = require("./routes/shippingMethod.route.js");
const SubCategoryRouter = require("./routes/subCategory.route.js");
const SubChildCategoryRouter = require("./routes/subChildCategory.route.js");
const UserRouter = require("./routes/user.route.js");
const WarehouseRouter = require("./routes/warehouse.route.js");
const WarehouseTransferRouter = require("./routes/warehouseTransfer.route.js");
const WishlistRouter = require("./routes/wishlist.js");

const rootRouter = Router();

// Route definitions - organized alphabetically
rootRouter.use("/about-us", AboutUsRouter);
rootRouter.use("/auth", AuthRouter);
rootRouter.use("/banners", BannerRouter);
rootRouter.use("/brand", BrandRouter);
rootRouter.use("/campaign", CampaignRouter);
rootRouter.use("/cart", CartRouter);
rootRouter.use("/category", CategoryRouter);
rootRouter.use("/child-category", ChildCategoryRouter);
rootRouter.use("/contact-info", ContactRouter);
rootRouter.use("/coupon", CouponRouter);
rootRouter.use("/inventory", InventoryRouter);
rootRouter.use("/newsletter", NewsletterRouter);
rootRouter.use("/order", OrderRouter);
rootRouter.use("/order-bulk", OrderBulkRouter);
rootRouter.use("/payment", PaymentRouter);
rootRouter.use("/payment-service-config", PaymentServiceConfigRouter);
rootRouter.use("/policy", PolicyRouter);
rootRouter.use("/product", ProductRouter);
rootRouter.use("/product-review", ProductReviewRouter);
rootRouter.use("/report", ReportRouter);
rootRouter.use("/role", RoleRouter);
rootRouter.use("/shipping-method", ShippingMethodRouter);
rootRouter.use("/sub-category", SubCategoryRouter);
rootRouter.use("/sub-child-category", SubChildCategoryRouter);
rootRouter.use("/user", UserRouter);
rootRouter.use("/warehouse", WarehouseRouter);
rootRouter.use("/warehouse-transfer", WarehouseTransferRouter);
rootRouter.use("/wish-list", WishlistRouter);

module.exports = rootRouter;
