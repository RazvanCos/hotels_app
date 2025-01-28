
import { Request, Response } from 'express';
import { Connection } from 'mysql2/promise';
import { RoomType } from '../../models/roomTypes';

export const roomTypesRoutes = async (app: any, db: Connection) => {
    
    // POST: Room type creation
    app.post('/seasons', async (req: Request, res: Response) => {
        const { organizationId, name, status } = req.body as RoomType;
        try {
            const [result]: any = await db.query(
                'INSERT INTO RoomTypes (OrganizationId, Name, Status) VALUES (?, ?, ?)',
                [organizationId, name, status]
            );
            res.status(201).json({ message: 'Room type created', id: result.insertId });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to insert room type', message: error.message })
        }
    });
}