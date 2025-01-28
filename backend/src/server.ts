import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { hotelsRoutes } from './routes/hotelsRoutes';
import { userRoutes } from './routes/userRoutes';
import { connectToDatabase, closeDatabase } from './database/database';
import { Connection } from 'mysql2/promise';


dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));

let userDbConnection: Connection | null = null;
let hotelsDbConnection: Connection | null = null;

const start = async () => {
    try {
        const userDbName: string= process.env.DB_USERS_NAME!;
        const hotelsDbName: string = process.env.DB_HOTELS_NUME!;
        // database connections
        userDbConnection = await connectToDatabase(userDbName); 
        hotelsDbConnection = await connectToDatabase(hotelsDbName);
        // Inregistrare rute
        userRoutes(app, userDbConnection);
        hotelsRoutes(app, hotelsDbConnection);
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
        if(userDbConnection) await closeDatabase(userDbConnection);
        if(hotelsDbConnection) await closeDatabase(hotelsDbConnection);
        console.log('MySql connection closed.');
    } catch (error: any) {
        console.error('Error closing database connection:', error);
    }
    process.exit(0);
};

process.on('SIGINT', handleShutdown); // Apăsare Ctrl+C
process.on('SIGTERM', handleShutdown); // Semnal de terminare

start();