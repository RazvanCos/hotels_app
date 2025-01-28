
import { Request, Response } from 'express';
import { Connection } from 'mysql2/promise';
import { Organization } from '../../models/organization.model';

export const organizationRoutes = async (app: any, db: Connection) => {
    
    // POST: Hotel creation(organization)
    app.post('/hotel', async (req: Request, res: Response) => {
        const { name, status } = req.body as Organization;
        try {
            const [result]: any = await db.query('INSERT INTO Organizations(Name, Status) VALUES (?, ?)', [name, status]);
            res.status(200).json({message: 'Organization created', id: result.insertId});
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to create organization', message: error.message })
        }
    });
}