
import config from "./config"

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
export const client = new MercadoPagoConfig({ accessToken: config.mpAccessToken });
export const preference = new Preference(client);