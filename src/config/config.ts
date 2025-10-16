import dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGODB_URL, JWT_SECRET } = process.env;

if (!PORT) {
  throw new Error('PORT is not defined');
}
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export default {
  port: PORT,
  mongodbUrl: MONGODB_URL,
  jwtSecret: JWT_SECRET || 'mysecret',
};

