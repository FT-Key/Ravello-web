import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";
import { createPreference } from "./paymentService.js";

export const createOrderService = async (items, userId, totalAmount, returnUrl) => {
  // Crea la preferencia de Mercado Pago
  const preference = await createPreference(items, returnUrl, { userId });

  // Crea el pago (en estado pendiente)
  const payment = await Payment.create({
    paymentId: preference.id,
    status: "pending",
    amount: totalAmount,
    user: userId,
  });

  // Crea la orden vinculada al pago
  const order = await Order.create({
    user: userId,
    items,
    totalAmount,
    payment: payment._id,
  });

  // Relaciona el pago con la orden
  payment.order = order._id;
  await payment.save();

  return {
    init_point: preference.init_point,
    order,
    payment,
  };
};
