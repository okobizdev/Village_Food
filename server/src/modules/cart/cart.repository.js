// const { CartSchema } = require("../../models/index.js");
const { CartSchema, CouponSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class CartRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createCart(payload, session) {
    const isObjectId = /^[a-f\d]{24}$/i.test(payload?.userRef);
    if (!isObjectId) {
      payload.correlationId = payload.userRef;
      delete payload.userRef
    }
    const newCart = await this.#model.create([payload], { session });
    return newCart;
  }

  async getAllCartByUser(payload) {
  const { userId, coupon } = payload;

  // 1️⃣ Determine if userId is ObjectId or correlationId
  const isObjectId = /^[a-f\d]{24}$/i.test(userId);
  const query = isObjectId ? { userRef: userId } : { correlationId: userId };

  // 2️⃣ Fetch all cart items with relations
  const carts = await this.#model
    .find(query)
    .populate("productRef")
    .populate("userRef")
    .populate("inventoryRef");

  if (!carts || carts.length === 0) {
    return {
      data: { cartDetails: [], totalPrice: 0, totalSaved: 0, couponDiscount: 0, productDiscount: 0 },
      message: "Cart is empty.",
    };
  }

  // 3️⃣ Validate coupon if provided
  let appliedCoupon = null;
  let message = "Viewing carts";

  if (coupon) {
    const existingCoupon = await CouponSchema.findOne({ code: coupon });
    message = `Sorry, that coupon isn’t valid.`;

    if (existingCoupon) {
      const now = new Date();
      const valid =
        now >= existingCoupon.startDate &&
        now <= existingCoupon.expireDate &&
        existingCoupon.used < existingCoupon.useLimit;

      if (valid) {
        appliedCoupon = existingCoupon;
        message = `Congratulations! Your coupon was applied successfully!`;
      }
    }
  }

  // 4️⃣ Initialize totals
  let subTotalPrice = 0;
  let totalPrice = 0;
  let totalSaved = 0;
  let totalCouponDiscount = 0;
  let productDiscount = 0;

  // 5️⃣ Loop through cart items and calculate totals
  const cartDetails = carts.map((cart) => {
    const product = cart.productRef;
    const inventory = cart.inventoryRef;
    const quantity = cart.quantity;

    const price = product?.price || 0;
    const discountAmount = product?.discountAmount || 0;
    const mrpPrice = product?.mrpPrice || 0

    let couponDiscount = 0;
    let subtotal;
    let savedAmount;

    // 🧮 Product-level discount
    const productDiscountTotal = discountAmount * quantity;

    // 🎟 Apply coupon if applicable
    if (appliedCoupon) {
      const applies =
        (String(appliedCoupon.categoryRef) === String(product.categoryRef)) ||
        (String(appliedCoupon.subCategoryRef) === String(product.subCategoryRef)) ||
        (String(appliedCoupon.childCategoryRef) === String(product.childCategoryRef)) ||
        (String(appliedCoupon.brandRef) === String(product.brandRef));

      if (applies) {
        if (appliedCoupon.type === "percent") {
          // Percentage discount
          couponDiscount = (mrpPrice  * appliedCoupon.discount) / 100;
        } else if (appliedCoupon.type === "flat") {
          // Flat discount (divide evenly if multiple eligible items)
          const eligibleItems = carts.filter((c) =>
            (String(appliedCoupon.categoryRef) === String(c.productRef.categoryRef)) ||
            (String(appliedCoupon.subCategoryRef) === String(c.productRef.subCategoryRef)) ||
            (String(appliedCoupon.childCategoryRef) === String(c.productRef.childCategoryRef)) ||
            (String(appliedCoupon.brandRef) === String(c.productRef.brandRef))
          );
          const perItemFlat = appliedCoupon.discount / eligibleItems.length;
          couponDiscount = perItemFlat;
        }

        couponDiscount = couponDiscount * quantity;
      }
      subtotal = mrpPrice * quantity;
      savedAmount = couponDiscount;
    }
    else{
     subtotal = price * quantity;
     savedAmount = productDiscountTotal;
    }

    
    
    subTotalPrice += subtotal;
    totalPrice += subtotal - couponDiscount;
    productDiscount += productDiscountTotal;
    totalCouponDiscount += couponDiscount;
    totalSaved += savedAmount;

    return {
      cartId: cart._id,
      quantity,
      product,
      inventory,
      subtotal,
      couponDiscount,
      savedAmount,
      productDiscount: productDiscountTotal,
    };
  });

  // 6️⃣ Return result summary
  return {
    data: {
      cartDetails,
      totalPrice,
      totalSaved,
      subTotalPrice,
      couponDiscount: totalCouponDiscount,
      productDiscount,
    },
    message,
  };
}


  async findCartByUserAndProduct(query) {
    return await this.#model.findOne(query);
  }

  async updateCart(id, payload) {
    const updatedCart = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedCart) {
      throw new Error("About Us not found");
    }
    return updatedCart;
  }

  async updateCartQuantity(cartId, quantity) {
    return await this.#model.findByIdAndUpdate(
      cartId,
      { $set: { quantity } },
      { new: true } // Return the updated document
    );
  }

  async getCartWithPagination(payload) {
    try {
      const carts = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const carts = await this.#model
            .find({ userRef: payload.userId })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalCart = await this.#model.countDocuments();

          return { doc: carts, totalDoc: totalCart };
        }
      );

      return carts;
    } catch (error) {
      console.error("Error getting carts with pagination:", error);
      throw error;
    }
  }
}

module.exports = new CartRepository(CartSchema);
