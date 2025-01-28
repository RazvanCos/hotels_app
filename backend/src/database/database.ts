import mysql, { Connection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async (dbName: string) : Promise<Connection>=> {
    const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = process.env;
    try {
        let connection: Connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: dbName
        });
        console.log(`Successfully connected to the database: ${dbName}`);
        return connection;
    } catch (error: any) {
        console.log(`Error on connecting to the database: ${dbName || DB_NAME}`, error.message);
        throw error;
    }
}

export const closeDatabase = async (connection: Connection): Promise<void> => {
    try {
        if(connection){
            await connection.end();
            console.log('Database connection closed');
        }
    } catch (error:any) {
        console.log('Error closing the database connection', error.message);
    }
}


