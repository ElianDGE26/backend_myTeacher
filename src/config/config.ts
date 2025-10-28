import dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGODB_URL, JWT_SECRET, FRONTEND_URL_DEV, FRONTEND_URL_PROD } = process.env;

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

export default {
  port: PORT,
  mongodbUrl: MONGODB_URL,
  jwtSecret: JWT_SECRET || 'mysecret',
  frontendUrlDev: FRONTEND_URL_DEV,
  frontendUrlProd: FRONTEND_URL_PROD, 
};


export const MODEL_NAMES = {
  USER: "users",
  SUBJECT: "subjects",
  PQR: "pqrs",
  PAYMENTS: "payments",
  BOOKINGS: "bookings",
  REVIEWS: "reviews",
  AVAILABILITIES: "availabilities",
};
