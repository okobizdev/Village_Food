const { Router } = require("express");
const controller = require("../../modules/payment/payment.controller.js");

const PaymentRouter = Router();

PaymentRouter.route("/")
  .post(controller.createUserPayment)
  .get(controller.getAllPayment);

PaymentRouter.route("/single/:id").get(controller.getSinglePayment);

PaymentRouter.get("/user", controller.getUserPayment);

// Payment provider callbacks / redirects
PaymentRouter.post("/success", controller.handlePaymentSuccess);
PaymentRouter.post("/fail", controller.handlePaymentFail);
PaymentRouter.route("/cancel")
  .get(controller.handlePaymentCancel)
  .post(controller.handlePaymentCancel);

PaymentRouter.post("/ipn", controller.handlePaymentIPN);

module.exports = PaymentRouter;
//https://server.unicrescent.com/api/v1/payment/ipn