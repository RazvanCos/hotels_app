import { connectDB } from '../database/database';
import { expect } from 'chai';

describe('Database Tests', () => {
    it('should connect to MongoDB', async () => {
        const db = await connectDB();
        expect(db).to.not.be.null;
    })
})