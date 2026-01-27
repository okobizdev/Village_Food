const { NotFoundError, BadRequestError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const orderRepository = require("./order.repository.js");

const cartRepository = require("../cart/cart.repository.js");
const inventoryRepository = require("../inventory/inventory.repository.js");
const { idGenerate } = require("../../utils/IdGenerator.js");
const { PaymentSchema } = require("../../models/index.js");
const { sendMail } = require("../../utils/sendMail.js");

class OrderService extends BaseService {
  #repository;
  #cartRepository;
  #inventoryRepository;
  constructor(repository, cartRepository, inventoryRepository, serviceName) {
    super(repository, cartRepository, serviceName);
    this.#repository = repository;
    this.#cartRepository = cartRepository;
    this.#inventoryRepository = inventoryRepository;
  }

  async createOrder(payload, session) {
    const {
      totalPrice,
      coupon,
      userRef,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      customerAddress,
      customerAltPhone,
      paymentMethod,
    } = payload;

    if (!userRef) throw new NotFoundError("User is required");
    if (!customerName) throw new NotFoundError("Customer name is required");
    if (!customerPhone) throw new NotFoundError("Customer phone is required");
    // if (!customerEmail) throw new NotFoundError("Customer email is required");
    if (!customerCity) throw new NotFoundError("Customer city is required");
    // if (!customerAddress)
    //   throw new NotFoundError("Customer address is required");
    // if (!customerAltPhone)
    //   throw new NotFoundError("Customer alt phone is required");
    if (!paymentMethod) throw new NotFoundError("Payment method is required");
    // if (!shippingCost) throw new NotFoundError("Shipping cost is required");
    // if (!subTotalPrice) throw new NotFoundError("Sub total price is required");
    // if (!totalPrice) throw new NotFoundError("Total price is required");
    const orderId = await idGenerate("ORD-", "orderId", this.#repository);
    payload.orderId = orderId;

    const orderData = await this.#repository.createOrder(payload, session);

    // --- send email to admin ---
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received: ${orderData.orderId}`,
      html: `
      <h1>New Order Received</h1>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      <p><strong>Customer Name:</strong> ${payload.customerName}</p>
      <p><strong>Customer Phone:</strong> ${payload.customerPhone}</p>
      <p><strong>Total Price:</strong> ${payload.totalPrice}</p>
      <p>Check the admin panel for more details.</p>
    `,
    };

    await sendMail(mailOptions);

    return orderData;
  }

  async createAdminOrder(payload, session) {
    const { userRef, orders, warehouseRef, payment } = payload;
    let paymentResult = null;
    if (payment > 0) {
      const paymentPayload = {
        amount: payment,
        userRef: userRef,
        warehouseRef: warehouseRef,
      };
      paymentResult = await PaymentSchema.create([paymentPayload], { session });
      payload.paymentRef = [paymentResult[0]?._id];
    }

    if (!warehouseRef) throw new NotFoundError("Warehouse is required");

    let productIds = [];
    let totalPrice = 0;
    let subTotalPrice = 0;
    let totalDiscount = 0;
    for (const order of orders) {
      const productInfo = await this.#inventoryRepository.findProductInfo(
        order
      );
      productIds.push({
        productRef: productInfo?.productRef?._id,
        inventoryRef: order?.inventoryID,
        quantity: order?.quantity,
        color: productInfo?.name,
        level: productInfo?.level,
        productDiscount: order?.discount,
      });
      totalPrice += productInfo?.productRef?.mrpPrice * Number(order?.quantity);
      totalDiscount += Number(order?.discount) * Number(order?.quantity) || 0;
      subTotalPrice +=
        productInfo?.productRef?.mrpPrice * Number(order?.quantity) -
          totalDiscount || 0;

      const availableQuantity = productInfo?.availableQuantity || 0;
      const quantityToHold = Number(order?.quantity);
      // console.log(
      //   "availableQuantity, quantityToHold",
      //   availableQuantity,
      //   quantityToHold
      // );
      if (availableQuantity < quantityToHold) {
        throw new Error(
          `Insufficient stock for product ${productInfo?.productRef?.name}`
        );
      }
      const inventoryID = order?.inventoryID;
      const inventoryPayload = {
        availableQuantity: availableQuantity - quantityToHold,
        holdQuantity: Number(productInfo?.holdQuantity) + quantityToHold,
      };
      await this.#inventoryRepository.inventoryOrderPlace(
        inventoryID,
        inventoryPayload,
        session
      );
    }
    payload.products = productIds;
    payload.totalPrice = totalPrice;
    payload.subTotalPrice = subTotalPrice;
    payload.discount = totalDiscount;

    payload.orderId = await idGenerate("ORD-", "orderId", this.#repository);

    const orderData = await this.#repository.create(payload, session);
    if (payment > 0) {
      const updatedPayment = await PaymentSchema.findByIdAndUpdate(
        paymentResult[0]._id,
        { orderRef: orderData[0]._id },
        { session, new: true }
      );
    }

    return orderData;
  }

  async getAllOrder() {
    return await this.#repository.findAll(
      {},
      ["products.productRef", "products.inventoryRef"],
      {
        "products.productRef": "productId",
        "products.inventoryRef": "inventoryID",
      }
    );
  }

  async getOrderWithPagination(payload) {
    const order = await this.#repository.getOrderWithPagination(payload);
    return order;
  }

  async getSingleOrder(id) {
    const orderData = await this.#repository.findById(id);
    if (!orderData) throw new NotFoundError("Order Not Find");
    return orderData;
  }

  async getUserAllOrder(id) {
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const query = {};
    if (!isObjectId) {
      query.correlationId = id;
    } else {
      query.userRef = id;
    }

    const orderData = await this.#repository.findAll(query, [
      "products.productRef",
    ]);
    if (!orderData) throw new NotFoundError("Order Not Find");
    return orderData;
  }

  async orderTracking(payload) {
    const { orderId } = payload;

    const orderData = await this.#repository.findAll({ orderId: orderId });
    if (!orderData) throw new NotFoundError("Order Not Find");
    return orderData;
  }

  async updateOrder(id, payload) {
    // Update the database with the new data
    const orderData = await this.#repository.updateOrder(id, payload);
    return orderData;
  }

  async updateOrderStatus(id, status, session) {
    if (!status) throw new NotFoundError("Status is required");
    const orderData = await this.#repository.findById(id);
    if (!orderData) throw new NotFoundError("Order not found");
    const updateInventoryStatus =
      await this.#inventoryRepository.updateInventoryStatus(
        status,
        orderData,
        session
      );

    // ll

    const order = await this.#repository.updateOrderStatus(id, status, session);

    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async deleteOrder(id) {
    const order = await this.#repository.findById(id);
    if (!order) throw new NotFoundError("Order not found");

    const allowedStatuses = ["Delivered", "Cancelled"];
    if (!allowedStatuses.includes(order.status)) {
      throw new BadRequestError(
        `Order with status '${order.status}' cannot be deleted`
      );
    }

    if (order.status === "Cancelled") {
      for (const product of order.products) {
        const inventoryRef = product.inventoryRef;

        if (!inventoryRef) continue; // skip if inventoryRef is null/undefined

        const inventory = await this.#inventoryRepository.findById(
          inventoryRef
        );
        if (!inventory) {
          console.warn(
            `Inventory not found for ID: ${inventoryRef}, skipping rollback`
          );
          continue; // skip this inventory but continue
        }

        const inventoryPayload = {
          availableQuantity:
            inventory.availableQuantity + Number(product.quantity),
          holdQuantity: inventory.holdQuantity - Number(product.quantity),
        };

        await this.#inventoryRepository.inventoryOrderPlace(
          inventoryRef,
          inventoryPayload
        );
      }
    }

    const deletedOrder = await this.#repository.deleteById(id);
    return deletedOrder;
  }
}

module.exports = new OrderService(
  orderRepository,
  cartRepository,
  inventoryRepository,
  "order"
);
