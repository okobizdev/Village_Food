require("dotenv").config();
const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const PaymentService = require("./payment.service.js");
const Email = require("../../utils/Email.js");


class PaymentController {
  createUserPayment = withTransaction(async (req, res, next, session) => {
    const userId = req.user.user_info_encrypted.id;
    const payload = {
      userRef: userId,
      userIdPayRef: req.body.userIdPayRef,
      amount: req.body.amount
    };
    const paymentResult = await PaymentService.createUserPayment(payload, session);
    const resDoc = responseHandler(200, "User Payment Created", paymentResult);
    res.status(resDoc.statusCode).json(resDoc);
  })

  getUserPayment = withTransaction(async (req, res, next, session) => {
    const userIdPayRef = req?.query?.userIdPayRef;
    const payload = {
      userIdPayRef: userIdPayRef
    };
    const paymentResult = await PaymentService.getUserPayment(payload, session);
    const resDoc = responseHandler(200, "User Payment get successfully", paymentResult);
    res.status(resDoc.statusCode).json(resDoc);
  })

  getAllPayment = catchError(async (req, res, next) => {
    const bookingRef = req.query.bookingRef
    const paymentResult = await PaymentService.getAllPayment(bookingRef);
    const resDoc = responseHandler(200, "Get All Payments", paymentResult);
    res.status(resDoc.statusCode).json(resDoc);
  })
  getSinglePayment = catchError(async (req, res, next) => {
    const id = req.params.id;
    const paymentResult = await PaymentService.getSinglePayment(id);
    const resDoc = responseHandler(200, "Get Single Payment", paymentResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllPaymentWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      paymentCategoryRef: req.query.paymentCategoryRef,
    }
    const paymentResult = await PaymentService.getAllPaymentWithPagination(payload);
    const resDoc = responseHandler(200, 'Payments get successfully', paymentResult);
    res.status(resDoc.statusCode).json(resDoc);
  });


  handlePaymentSuccess = async (req, res, next) => {
    const bookingId = req.query.tran_id || req.body.tran_id;

    try {
      if (!bookingId) {
        return res.status(400).send("Missing bookingId/tran_id");
      }
      const booking = await PaymentService.handlePaymentSuccess(bookingId);

      
      if (booking) {
        const successUrl = `${process.env.CLIENT_BASE_URL}/payment-success?bookingId=${bookingId}`;
        return res.redirect(successUrl);
      } else {
        return res.status(404).send("Booking not found.");
      }
    } catch (err) {
      next(err);
    }
  };

  handlePaymentFail = async (req, res, next) => {
    const bookingId = req.query.tran_id || req.body.tran_id;
    try {
      if (!bookingId) {
        return res.status(400).send("Missing bookingId/tran_id");
      }
      const booking = await PaymentService.handlePaymentFail(bookingId);
      if (booking) {
        const failedUrl = `${process.env.CLIENT_BASE_URL}/payment-fail?bookingId=${bookingId}`;
        return res.redirect(failedUrl);
      } else {
        return res.status(404).send("Booking not found.");
      }
    } catch (err) {
      next(err);
    }
  };

  handlePaymentCancel = async (req, res, next) => {
    const bookingId = req.query.tran_id || req.body.tran_id;
    
    try {
      if (!bookingId) {
        return res.status(400).send("Missing bookingId/tran_id");
      }
      const booking = await PaymentService.handlePaymentCancel(bookingId);
      if (booking) {
        const cancelUrl = `${process.env.CLIENT_BASE_URLs}/payment-cancel?bookingId=${bookingId}`;
        return res.redirect(cancelUrl);
      } else {
        return res.status(404).send("Product not found.");
      }
    } catch (err) {
      next(err);
    }
  };

  handlePaymentIPN = async (req, res, next) => {
    const ipnData = req.body;
    try {
      if (!ipnData.tran_id) {
        return res.status(400).send("Missing tran_id in IPN data");
      }
      await PaymentService.handlePaymentIPN(ipnData);
      return res.status(200).send("IPN received and processed");
    } catch (err) {
      console.error("IPN Error:", err);
      return res.status(500).send("Error processing IPN");
    }
  };


}

module.exports = new PaymentController();

