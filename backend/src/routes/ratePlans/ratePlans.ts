
import { Request, Response } from 'express';
import { Connection } from 'mysql2/promise';
import { RatePlans } from '../../models/ratePlans.model';

export const ratePlansRoutes = async (app: any, db: Connection) => {
    
    // POST: Add Rate plan
    app.post('/rate-plans', async (req: Request, res: Response) => {
        const { organizationId, name, status } = req.body as RatePlans;
        try {
            const [result]: any = await db.query(
                'INSERT INTO RatePlans (OrganizationId, Name, Status) VALUES (?, ?, ?)',
                [organizationId, name, status]
            );
            res.status(201).json({ message: 'Rate plan created', id: result.insertId });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to create rate plan', message: error.message })
        }
    });
}