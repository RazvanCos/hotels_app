import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { Connection } from 'mysql2/promise';

export const userRoutes = (app: any, db: Connection): void => {

    // POST: Create user
    app.post('/register', async (req: Request, res: Response) => {
        const { nume, prenume, email, password, role = 'user' } = req.body as User;

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                error: 'Password must contain at least one uppercase letter, one digit, and one special character (@$!%*?&), and be at least 8 characters long.',
            });
        }

        try {
            // Check if user already exists
            const [rows]: [any[], any] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
            if (rows.length > 0) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Password crypting
            const hashedPass = await bcrypt.hash(password, 10);

            // Insert users into database
            const [result]: any = await db.query(
                'INSERT INTO Users (Nume, Prenume, Email, PasswordHash, Role) VALUES (?, ?, ?, ?, ?)',
                [nume, prenume, email, hashedPass, role]
            );

            res.status(200).json({
                message: 'User registered successfully!',
                userId: result.insertId,
            });
        } catch (error: any) {
            console.error('Error registering user:', error.message);
            res.status(500).json({
                error: 'Failed to register user',
                message: error.message,
            });
        }
    });


    // POST Authenticate users
    app.post('/login', async (req: Request, res: Response) => {
        const { email, password } = req.body as User;
        try {
            const [user]:any[] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
            if (!user) {
                return res.status(404).send({message:'User not found'} )
            }

            const isPasswordValid = await bcrypt.compare(password, user[0].PasswordHash);
            if (!isPasswordValid) {
                return res.status(401).send({message:'Invalid email or password'});
            }

            // const token = jwt.sign({ username: user.username, userId: user._id }); 
            return res.send({ message: 'Login successful', user: {username: user[0].Nume, email: user[0].email}});
        } catch (error: any) {
            return res.status(500).send({ error: 'Failed to login!', message: error.message });
        }
    });

    // PUT Password update
    app.put('/users/update-password', async (req: Request, res: Response) => {
        const { email, oldPassword, newPassword } = req.body as { email: string, oldPassword: string, newPassword: string }
        try {
            const [user]: any[] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
            if (!user) {
                return res.status(400).send({ error: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(oldPassword, user[0].PasswordHash);
            if (!isPasswordValid) {
                return res.status(400).send({ error: 'Old password is incorrect' });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await db.query('UPDATE Users SET PasswordHash = ? WHERE Email = ?', [hashedNewPassword, email]);

            res.send({message: 'Password updated successfully!'});
        } catch (error: any) {
            res.status(500).send({ error: 'Failed to update password', message: error.message });
        }
    });


    // PUT Email update
    app.put('/users/update-email', async (req: Request, res: Response) => {
        const { email, newEmail } = req.body as { email: string, newEmail: string };
        try {
            const [user]: any[] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
            if (!user) {
                return res.status(400).send({ error: 'User not found' });
            }
            await db.query('UPDATE Users SET PasswordHash = ? WHERE Email = ?', [newEmail, email]);
            res.send({message: 'Email updated successfully!'});
        } catch (error: any) {
            res.status(500).send({ error: 'Failed to update email', message: error.message });
        }
    });
}