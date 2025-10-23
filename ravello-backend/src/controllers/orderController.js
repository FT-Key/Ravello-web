import { createOrderService } from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    const { items, userId, totalAmount } = req.body;
    const returnUrl = "http://localhost:5173"; // o usar tu dominio

    const result = await createOrderService(items, userId, totalAmount, returnUrl);

    res.status(201).json({
      message: "Orden creada correctamente",
      init_point: result.init_point,
      order: result.order,
      payment: result.payment,
    });
  } catch (err) {
    next(err);
  }
};
