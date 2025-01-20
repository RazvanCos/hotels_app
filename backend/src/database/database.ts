import mysql from 'mysql2/promise'
import dotenv from 'dotenv';

dotenv.config();
let dbConnection: mysql.Connection | null = null;


export const connectToDatabase = async () => {
    const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = process.env;
    try {
        dbConnection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
        console.log('Successfully connected to the database');
        return dbConnection;
    } catch (error: any) {
        console.log(`Error on connecting to the database`, error.message);
        throw error;
    }
}

export const closeDatabase = async () => {
    try {
        if(dbConnection){
            await dbConnection.end();
            console.log('Database connection closed');
        }
    } catch (error:any) {
        console.log('Error closing the database connection', error.message);
    }
}


