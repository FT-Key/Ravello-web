import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

const cliente = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const createPreference = async (productos, returnUrl, user = {}) => {
  const items = productos.map((prod) => ({
    title: prod.title,
    quantity: Number(prod.quantity || prod.cantidad || 1),
    unit_price: Number(prod.unit_price || prod.precio || prod.price || 0),
    currency_id: "ARS",
  }));

  const preference = new Preference(cliente);

  const baseUrl = returnUrl.endsWith("/") ? returnUrl.slice(0, -1) : returnUrl;

  const result = await preference.create({
    body: {
      items,
      back_urls: {
        success: `${baseUrl}/payments/success`,
        failure: `${baseUrl}/payments/failure`,
        pending: `${baseUrl}/payments/pending`,
      },
      auto_return: "approved",
    },
  });

  return {
    id: result.id,
    init_point: result.init_point,
  };
};
