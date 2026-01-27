require('dotenv').config();
const BaseService = require("../base/base.service.js");
const paymentRepository = require("./payment.repository.js");
const authRepository = require("../auth/auth.repository.js");
const Email = require("../../utils/Email.js");
const { OrderSchema } = require("../../models/order/orderSchema.js");
const { default: mongoose } = require("mongoose");
const productController = require("../product/product.controller.js");
const orderRepository = require('../order/order.repository.js');

// Use SERVER_URL from .env for all payment endpoints
const successUrl = `${process.env.SERVER_URL}/payment/success`;
const failUrl = `${process.env.SERVER_URL}/payment/fail`;
const cancelUrl = `${process.env.SERVER_URL}/payment/cancel`;
const ipnUrl = `${process.env.SERVER_URL}/payment/ipn`;
const SSLCOMMERZ_API_URL = process.env.SSLCOMMERZ_API_URL;
const SSLCOMMERZ_STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const SSLCOMMERZ_STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
const SSLCOMMERZ_VALIDATION_API = process.env.SSLCOMMERZ_VALIDATION_API;


class PaymentService extends BaseService {
  #repository;
  #authRepository;
  constructor(repository, authRepository, serviceName) {
    super(repository, authRepository, serviceName);
    this.#repository = repository;
    this.#authRepository = authRepository;
  }
  
  initiateSSLCommerzPayment = async (
    bookingId,
    totalPrice,
    user,
    name,
    email,
    phone
  ) => {

    const postData = {
      store_id: SSLCOMMERZ_STORE_ID,
      store_passwd: SSLCOMMERZ_STORE_PASSWORD,
      total_amount: totalPrice,
      currency: "BDT",
      tran_id: bookingId,
      success_url: `${successUrl}?tran_id=${bookingId}`,
      fail_url: `${failUrl}?tran_id=${bookingId}`,
      cancel_url: `${cancelUrl}?tran_id=${bookingId}`,
      ipn_url: `${ipnUrl}`,
      cus_name: name,
      cus_email: email,
      cus_add1: "Dhaka",
      cus_add2: "",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1207",
      cus_country: "Bangladesh",
      cus_phone: phone,
      // cus_fax: "",
      // multi_card_name: "",
      shipping_method: "NO",
      product_name: "Travel Booking",
      //  product_category: productCategory || "DEFAULT",
      product_profile: "general",
      product_category: "null",
    };
   

    const formData = new URLSearchParams(postData).toString();


    try {
      const response = await fetch(SSLCOMMERZ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
  

      const data = await response.json();

      if (data && data.GatewayPageURL) {
        return data.GatewayPageURL;
      } else {
        throw new Error(data.failedreason || "No GatewayPageURL returned");
      }
    } catch (error) {
      console.error("SSLCommerz error:", error.message || error);
      return "";
    }
  };

  handlePaymentCancel = async (bookingId) => {
    let booking = null;
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      try {
        booking = await this.#repository.findOne({ _id: bookingId });
      } catch (error) {
        console.error("Error finding booking in generic repository:", error);
      }

      if (!booking) {
        booking = await OrderSchema.findById(bookingId);
      }
    }


    if (!booking) {
      booking = await OrderSchema.findOne({
        $or: [
          { tran_id: bookingId }, 
          { orderNumber: bookingId }, 
        ],
      });
    }

    if (booking) {
      booking.paymentStatus = "CANCELLED";
      booking.status = "Cancelled";
      await booking.save();
     
      return booking;
    }

    return null;
  };

  handlePaymentSuccess = async (bookingId) => {
    let booking = null;
    booking = await this.#repository.findOne({ _id: bookingId });
    // Try to find in Tourism booking first
    booking = await OrderSchema.findById(bookingId);
   
    if (booking) {
      booking.paymentStatus = "COMPLETED";
      booking.status = "OrderPlaced";
      await booking.save();

      return booking;
    }
  };

  handlePaymentFail = async (bookingId) => {
    let booking = null;
    booking = await this.#repository.findOne({ _id: bookingId });
    booking = await OrderSchema.findById(bookingId);
    if (booking) {
      booking.paymentStatus = "FAILED";
      booking.status = "Cancelled";
      await booking.save();

      return booking;
    }
  };

  handlePaymentIPN = async (ipnData) => {
    const { tran_id, val_id, status: ipnStatus } = ipnData;
    const validationUrl = `${SSLCOMMERZ_VALIDATION_API}?val_id=${val_id}&store_id=${SSLCOMMERZ_STORE_ID}&store_passwd=${SSLCOMMERZ_STORE_PASSWORD}&v=1&format=json`;

    let validationResponse;
    try {
      const response = await fetch(validationUrl);
      validationResponse = await response.json();
    } catch (error) {
      console.error("SSLCommerz validation request failed:", error);
      throw new Error("IPN validation request failed.");
    }

    if (
      validationResponse.status !== "VALID" &&
      validationResponse.status !== "VALIDATED"
    ) {
      console.error("IPN validation failed:", validationResponse);
      return;
    }

    const schemas = [OrderSchema];

    let booking = null;
    for (const SchemaModel of schemas) {
      booking = await SchemaModel.findById(tran_id);
      if (booking) break;
    }

    if (booking) {
      if (ipnStatus === "VALID" || ipnStatus === "VALIDATED") {
        booking.paymentStatus = "COMPLETED";
        // booking.status = "CONFIRMED";
      } else {
        booking.paymentStatus = ipnStatus;
        booking.status = "Cancelled";
      }
      await booking.save();
 
    } else {
      console.error(`Booking with tran_id ${tran_id} not found.`);
    }

    return booking;
  };
}

module.exports = new PaymentService(
  orderRepository,
  authRepository,
  "payment"
);
