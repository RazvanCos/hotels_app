
import { Request, Response } from 'express';
import { Connection } from 'mysql2/promise';
import { Season } from '../../models/season.model';

export const seasonRoutes = async (app: any, db: Connection) => {
    
    // POST: Season creation
    app.post('/seasons', async (req: Request, res: Response) => {
        const { organizationId, name, status, startDate, endDate } = req.body as Season;
        try {
            const [result]: any = await db.query(
                'INSERT INTO Seasons (OrganizationId, Name, Status, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)',
                [organizationId, name, status, startDate, endDate]
            );
            res.status(201).json({ message: 'Season created', id: result.insertId });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to create season', message: error.message })
        }
    });
}