
import { Request, Response } from 'express';
import { Connection } from 'mysql2/promise';
import { Prices } from '../../models/prices.model';

export const pricesRoutes = async (app: any, db: Connection) => {
    
    // POST: Add prices
    app.post('/prices', async (req: Request, res: Response) => {
        const { organizationId, seasonId, roomId, rateId, price } = req.body as Prices;
        try {
            const [result]: any = await db.query(
                'INSERT INTO Prices (OrganizationId, SeasonId, RoomId, RateId, Price) VALUES (?, ?, ?, ?, ?)',
                [organizationId, seasonId, roomId, rateId, price]
            );
            res.status(201).json({ message: 'Price added', id: result.insertId });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to add prices', message: error.message })
        }
    });
}