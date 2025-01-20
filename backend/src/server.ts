import express from 'express';
// import mysql from 'mysql2/promise'
import cors from 'cors';
// import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import { employeeRoutes } from './routes/employeesRoutes';
// import { userRoutes } from './routes/userRoutes';
import { connectToDatabase, closeDatabase } from './database/database';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));


const start = async () => {
    try {
        await connectToDatabase(); // conectare la DB
        // await connectToDatabase();
        // Inregistrare rute
        // await employeeRoutes(app, db);
        // await userRoutes(app, db);
        const port: string = process.env.PORT || '3000';
        app.listen(port, () => {
            console.log('Server is running on http://localhost:3000')
        });
    } catch (error: any) {
        console.error('Error starting the server', error.message);
        process.exit(1);  // oprire aplicatie in caz de eroare
    }
};

const handleShutdown = async () => {
    console.log('Shutting down server...');
    try {
        await closeDatabase(); // Close database connection
        console.log('MySql connection closed.');
    } catch (error: any) {
        console.error('Error closing database connection:', error);
    }
    process.exit(0);
};

process.on('SIGINT', handleShutdown); // Apăsare Ctrl+C
process.on('SIGTERM', handleShutdown); // Semnal de terminare

start();