import dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGODB_URL, JWT_SECRET, FRONTEND_URL_DEV, 
  FRONTEND_URL_PROD, JWT_SECRET_REFRESH_TOKEN, MP_ACCESS_TOKEN, 
  URL_NOTIFICATION_NGROK, URL_BACKEND_PROD, URL_FRONTEND_NGROK, 
  EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE , EMAIL_FROM} = process.env;

if (!PORT) {
  throw new Error('PORT is not defined');
}
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
if (!FRONTEND_URL_DEV) {
  throw new Error('FRONTEND_URL_DEV is not defined');
}
if (!FRONTEND_URL_PROD) {
  throw new Error('FRONTEND_URL_PROD is not defined');
}
if (!JWT_SECRET_REFRESH_TOKEN) {
  throw new Error('JWT_SECRET_REFRESH_TOKEN is not defined');
}
if (!MP_ACCESS_TOKEN) {
  throw new Error('MP_ACCESS_TOKEN is not defined');
}
if (!URL_NOTIFICATION_NGROK) {
  throw new Error('URL_NOTIFICATION_NGROK is not defined');
}
if (!URL_BACKEND_PROD) {
  throw new Error('URL_BACKEND_PROD is not defined');
}
if (!URL_FRONTEND_NGROK) {
  throw new Error('URL_FRONTEND_NGROK is not defined');
}
if (!EMAIL_HOST) {
  throw new Error('EMAIL_HOST is not defined');
}
if (!EMAIL_PORT) {
  throw new Error('EMAIL_PORT is not defined');
}
if (!EMAIL_USER) {
  throw new Error('EMAIL_USER is not defined');
}
if (!EMAIL_PASS) {
  throw new Error('EMAIL_PASS is not defined');
}
if (!EMAIL_SECURE) {
  throw new Error('EMAIL_SECURE is not defined');
}
if (!EMAIL_FROM) {
  throw new Error('EMAIL_FROM is not defined');
}

export default {
  port: PORT,
  mongodbUrl: MONGODB_URL,
  jwtSecret: JWT_SECRET || 'mysecretPass0w0rd12354784llsds657493',
  jwtSecretRefreshToken: JWT_SECRET_REFRESH_TOKEN || '3ste2sUnP@assw0rd951357846254',
  frontendUrlDev: FRONTEND_URL_DEV,
  frontendUrlProd: FRONTEND_URL_PROD, 
  mpAccessToken: MP_ACCESS_TOKEN, 
  urlNotificationNgrok: URL_NOTIFICATION_NGROK,
  urlBackendProd: URL_BACKEND_PROD,
  urlFrontendNgrok: URL_FRONTEND_NGROK,
  emailHost: EMAIL_HOST,
  emailPort: EMAIL_PORT,
  emailUser: EMAIL_USER,
  emailPass: EMAIL_PASS,
  emailSecure: EMAIL_SECURE,
  emailFrom: EMAIL_FROM
};


export const MODEL_NAMES = {
  USER: "users",
  SUBJECT: "subjects",
  PQR: "pqrs",
  PAYMENTS: "payments",
  BOOKINGS: "bookings",
  REVIEWS: "reviews",
  AVAILABILITIES: "availabilities",
  SESSIONS: "sessions"
};
