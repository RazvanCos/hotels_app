
import { Application, Request, Response } from 'express';
import { Employee } from '../models/employee.model';

export const employeeRoutes = async (app: Application, db: any) => {
    // POST: Creare angajat
    app.post('/employees', async (req: Request, res: Response) => {
        const body = req.body as Employee | Employee[];
        try {
            const 
        } catch (error: any) {
           console.error('Error inserting data', error.message)
        }
    });

    // GET: Obtinere lista de angajati
    app.get('/employees', async (_, reply) => {
        try {
            const employees = await db.collection('employees').find().toArray();
            return { employees }
        } catch (error) {
            reply.status(500).send({ error: 'Failed to fetch employees from DB' });
        }
    });

    // DELETE: Stergere angajat
    app.delete('/employees/:id?', async (request, reply) => {
        const { id } = request.params as { id?: string };
        const { ids } = request.body as { ids?: string[] };
        try {
            if (id) {
                if (!isValidObjectId(id)) {
                    return reply.status(400).send({ error: 'Invalid ObjectId format' });
                }
                const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    return reply.status(404).send({ error: 'Employee not found' });
                }
                return { message: 'Employee deleted successfully!' }
            }
            if (ids && Array.isArray(ids)) {
                const idArray = ids.filter(isValidObjectId).map(id => new ObjectId(id));
                const result = await db.collection('employees').deleteMany({ _id: { $in: idArray } });
                return { deletedCount: result.deletedCount, message: 'Employees deleted successfully!' }
            }
            return reply.status(400).send({ error: 'No employee id provided in URL or in the body!' });
        } catch (error) {
            reply.status(500).send({ error: 'Failed to delete employee from DB' });
        }
    });

    // PUT: Actualizare angajat
    app.put('/employees/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const updateData = request.body as Partial<Employee>;
        if (!isValidObjectId(id)) {
            return reply.status(400).send({ error: 'Invalid ObjectId format' });
        }
        try {
            const result = await db.collection('employees').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
            if (result.matchedCount === 0) {
                return reply.status(404).send({ error: 'Employee not found' });
            }
            return { message: 'Employee updated successfully!' }
        } catch (error) {
            reply.status(500).send({ error: 'Failed to update employee in DB' });
        }
    });
}