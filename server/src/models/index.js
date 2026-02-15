module.exports = {
  UserSchema: require("./auth/userSchema.js").UserSchema,
  BannerSchema: require("./banner/bannerSchema.js").BannerSchema,
  BrandSchema: require("./brand/brandSchema.js").BrandSchema,
  CategorySchema: require("./category/categorySchema.js").CategorySchema,
  SubCategorySchema: require("./subCategory/subCategorySchema.js")
    .SubCategorySchema,
  ChildCategorySchema: require("./childCategory/childCategorySchema.js").ChildCategorySchema,
  ContactInfoSchema: require("./contact/contactInfoSchema.js").ContactInfoSchema,
  CouponSchema: require("./coupon/couponSchema.js").CouponSchema,
  InventorySchema: require("./inventory/inventorySchema.js").InventorySchema,
  OrderSchema: require("./order/orderSchema.js").OrderSchema,
  ProductSchema: require("./product/productSchema.js").ProductSchema,
  CartSchema: require("./cart/cartSchema.js").CartSchema,
  ProductReviewSchema: require("./productReview/productReviewSchema.js").ProductReviewSchema,
  RoleSchema: require("./role/roleSchema.js").RoleSchema,
  PaymentServiceConfigSchema:
    require("./paymentServiceConfig/paymentServiceConfigSchema.js")
      .PaymentServiceConfigSchema,
  PaymentSchema: require("./payment/paymentSchema.js").PaymentSchema,
  CampaignSchema: require("./campaign/campaignSchema.js").CampaignSchema,
};
