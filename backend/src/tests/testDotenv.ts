import dotenv from 'dotenv';

dotenv.config();

console.log('DB_CONNECTION_STRING:', process.env.DB_CONNECTION_STRING);
console.log('JWT_SECRET:', process.env.JWT_SECRET);