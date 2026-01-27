// const { OrderSchema } = require("../../models/index.js");
const {
  OrderSchema,
  CartSchema,
  CouponSchema,
  InventorySchema,
  ProductSchema,
} = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class OrderRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createOrder(payload, session) {
    const {
      orderId,
      shippingCost = 0,
      coupon,
      userRef,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      customerAddress,
      customerAltPhone,
      paymentMethod,
      // ⭐ Added fields
      mobileBankingProvider,
      mobileNumber,
      transactionId,
    } = payload;

    const isObjectId = /^[a-f\d]{24}$/i.test(userRef);
    const query = isObjectId ? { userRef } : { correlationId: userRef };

    // Get cart items
    const carts = await CartSchema.find(query).populate("productRef");

    if (!carts.length) throw new Error("Cart is empty");

    // Coupon validate
    let appliedCoupon = null;
    if (coupon) {
      const now = new Date();
      const existCoupon = await CouponSchema.findOne({ code: coupon });

      if (
        existCoupon &&
        now >= existCoupon.startDate &&
        now <= existCoupon.expireDate
      ) {
        appliedCoupon = existCoupon;
      }
    }

    let subTotalPrice = 0;
    let totalCouponDiscount = 0;
    let productDiscountTotal = 0;

    const cartDetails = carts.map((cart) => {
      const product = cart.productRef;
      const qty = cart.quantity;

      const mrp = product.mrpPrice || 0;
      const price = product.price || mrp;

      const productDiscount = price < mrp ? (mrp - price) * qty : 0;

      productDiscountTotal += productDiscount;
      subTotalPrice += price * qty;

      let couponDiscount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.type === "percent") {
          couponDiscount = ((mrp * appliedCoupon.discount) / 100) * qty;
        } else if (appliedCoupon.type === "flat") {
          couponDiscount = (appliedCoupon.discount / carts.length) * qty;
        }
      }

      totalCouponDiscount += couponDiscount;

      return {
        cartId: cart._id,
        product,
        quantity: qty,
        subtotal: price * qty,
        productDiscount,
        couponDiscount,
        savedAmount: productDiscount + couponDiscount,
      };
    });

    const totalPrice =
      payload.totalPrice ?? subTotalPrice - totalCouponDiscount + shippingCost;

    const finalSubTotal = payload.subTotalPrice ?? subTotalPrice;

    // Build product list for Order
    const products = carts.map((c) => ({
      productRef: c.productRef._id,
      quantity: c.quantity,
      price: c.productRef.price,
      mrpPrice: c.productRef.mrpPrice,
      inventoryRef: c.inventoryRef,
    }));

    // Create order
    const newOrder = await this.#model.create(
      [
        {
          orderId,
          subTotalPrice: finalSubTotal,
          totalPrice,
          shippingCost,
          couponDiscount: totalCouponDiscount,
          productDiscount: productDiscountTotal,
          status: "OrderPlaced",
          ...query,
          couponRef: appliedCoupon?._id || null,
          customerName,
          customerPhone,
          customerEmail,
          customerCity,
          customerAddress,
          customerAltPhone,
          paymentMethod,
          products,
          // ⭐ Added fields
          mobileBankingProvider,
          mobileNumber,
          transactionId,
        },
      ],
      { session }
    );

    for (const item of products) {
      const productId = item.productRef;
      const qty = item.quantity;

      await InventorySchema.findOneAndUpdate(
        { productRef: productId },
        {
          $inc: {
            availableQuantity: -qty,
            soldQuantity: qty,
          },
        },
        { session }
      );

      await ProductSchema.findByIdAndUpdate(
        productId,
        {
          $inc: {
            totalSales: qty,
            totalOrders: 1,
            totalStockValue: -(qty * item.price),
          },
        },
        { session }
      );
      await ProductSchema.findByIdAndUpdate(
        productId,
        {
          $inc: {
            totalStockValue: -(item.quantity * item.price),
          },
        },
        { session }
      );
      await ProductSchema.findByIdAndUpdate(
        productId,
        { $inc: { totalOrders: 1, totalSales: qty } },
        { session }
      );
    }

    // Delete cart items
    await CartSchema.deleteMany(query, { session });

    return newOrder[0];
  }

  async updateOrder(id, payload) {
    const updatedOrder = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedOrder) {
      throw new Error("About Us not found");
    }
    return updatedOrder;
  }
  // async deleteOrder(id) {
  //   const updatedOrder = await this.#model.findByIdAndDelete(id);
  //   if (!updatedOrder) {
  //     throw new Error("About Us not found");
  //   }
  //   return updatedOrder;
  // }
  async getOrderWithPagination(payload) {
    try {
      const orders = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const orders = await this.#model
            .find({ warehouseRef: payload.warehouseRef })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate("paymentRef")
            .populate("products.productRef")
            .populate("products.inventoryRef")
            .populate({
              path: "userRef",
              select: "-password", // Exclude the password field
            })
            .populate("couponRef");
          // .populate('')
          const totalOrder = await this.#model.countDocuments({
            warehouseRef: payload.warehouseRef,
          });
          return { doc: orders, totalDoc: totalOrder };
        }
      );

      return orders;
    } catch (error) {
      console.error("Error getting orders with pagination:", error);
      throw error;
    }
  }

  async updateOrderStatus(id, status) {
    const updatedOrder = await this.#model.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    return updatedOrder;
  }

  async getOrderReport(startDate, endDate) {
    const statuses = [
      "OrderPlaced",
      "DeliveredPending",
      "Delivered",
      "Cancelled",
      "Hold",
      "InReview",
    ];

    const orders = await OrderSchema.aggregate([
      // Match only orders within the time frame
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      // Group by status and sum values
      {
        $group: {
          _id: "$status",
          totalOrders: { $sum: 1 },
          totalSubTotalPrice: { $sum: { $ifNull: ["$subTotalPrice", 0] } },
          totalProducts: { $sum: { $sum: "$products.quantity" } },
        },
      },
      // Add missing statuses
      {
        $group: {
          _id: null,
          existingStatuses: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          mergedData: {
            $map: {
              input: statuses,
              as: "status",
              in: {
                status: "$$status", // Rename _id to status
                totalOrders: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$existingStatuses",
                              as: "e",
                              cond: { $eq: ["$$e._id", "$$status"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$match.totalOrders", 0] },
                  },
                },
                totalSubTotalPrice: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$existingStatuses",
                              as: "e",
                              cond: { $eq: ["$$e._id", "$$status"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$match.totalSubTotalPrice", 0] },
                  },
                },
                totalProducts: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$existingStatuses",
                              as: "e",
                              cond: { $eq: ["$$e._id", "$$status"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$match.totalProducts", 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: "$mergedData" },
      { $replaceRoot: { newRoot: "$mergedData" } },
      { $sort: { totalOrders: -1 } }, // Sort by total orders (optional)
    ]);

    // If no orders are found, return the statuses with zero values
    if (orders.length === 0) {
      return statuses.map((status) => ({
        status: status, // Rename _id to status
        totalOrders: 0,
        totalSubTotalPrice: 0,
        totalProducts: 0,
      }));
    }

    return orders;
  }
  async getProfitLossReport(startDate, endDate, warehouseRef) {
    const orders = await OrderSchema.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          warehouseRef,
        },
      },
    ]);
  }
}

module.exports = new OrderRepository(OrderSchema);
