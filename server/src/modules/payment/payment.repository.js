
const { OrderSchema } = require("../../models/order/orderSchema.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class PaymentRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createPayment(payload, session) {
    const newPayment = await this.#model.create([payload], { session });

    return newPayment;
  }
  async getAllPayment(bookingRef) {

    if (bookingRef) {
      return await this.#model.find({ bookingRef }).populate("bookingRef").populate({
        path: 'userRef',
        select: '-password' // Exclude the 'password' field
      }).sort({ createdAt: -1 });;
    } else {
      // populote userRef , bookingRef
      return await this.#model.find().populate("bookingRef").populate({
        path: 'userRef',
        select: '-password' // Exclude the 'password' field
      }).sort({ createdAt: -1 });;
    }
  }

  async getAllPaymentWithPagination(payload) {
    try {
      const { paymentCategoryRef } = payload;
      const payments = await pagination(payload, async (limit, offset, sortOrder) => {
        const query = {};
        if (paymentCategoryRef) {
          query.paymentCategoryRef = paymentCategoryRef;
        }
        const payments = await this.#model.find(query)
          .sort({ createdAt: sortOrder, })
          .skip(offset)
          .limit(limit)
        // .populate('') 
        // .populate('') 


        // Count total documents
        const totalPayment = await this.#model.countDocuments();

        return { doc: payments, totalDoc: totalPayment };
      });

      return payments;
    } catch (error) {
      console.error("Error getting payments with pagination:", error);
      throw error;
    }
  }

  async getUserIdByPayment(payload, session) {
    const { userIdPayRef } = payload;
    // if userIdPayRef than this wise find other wise this has any userIdPayRef all get 
    if (userIdPayRef) {
      return await this.#model.find({ userIdPayRef }).populate({
        path: 'userRef',
        select: '-password' // Exclude the 'password' field
      }).sort({ createdAt: -1 });;
    } else {
      return await this.#model.find().populate({
        path: 'userRef',
        select: '-password' // Exclude the 'password' field
      }).sort({ createdAt: -1 });;
    }
  }
}

module.exports = new PaymentRepository(OrderSchema);

