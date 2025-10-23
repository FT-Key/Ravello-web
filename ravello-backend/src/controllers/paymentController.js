import Payment from "../models/paymentModel.js";

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { paymentId: id },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.json({ message: "Estado actualizado", payment });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pago", error });
  }
};
