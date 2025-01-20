import { FastifyInstance } from 'fastify';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export const userRoutes = async (server: FastifyInstance, db: any) => {

    console.log(server.authenticate);

    // POST for creating users
    server.post('/register', async (request, reply) => {
        const { username, email, password } = request.body as User;
        // Validate password
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if(!passwordRegex.test(password)){
            return reply.status(400).send({error: 'Password must contain at least one uppercase letter, one digit, and one special character (@$!%*?&), and be at least 8 characters long.'})
        }
        try {
            // Check if the user already exists
            const existingUser = await db.collection('users').findOne({ username });
            if (existingUser) {
                return reply.status(400).send({ error: 'Username already exists' });
            }
            // Crypted password
            const hashedPass = await bcrypt.hash(password, 10);
            // Add users in 'users' collection
            const result = await db.collection('users').insertOne({
                username,
                email,
                password: hashedPass,
            })
            return { message: 'User registered successfully!', userId: result.insertedId };
        } catch (error: any) {
            reply.status(500).send({ error: 'Failed to register user', message: error.message});
        }
    });

    // POST for user autentication
    server.post('/login', async (request, reply) => {
        const { username, password } = request.body as User;
        try {
            const user = await db.collection('users').findOne({ username });
            if (!user) {
                return reply.status(404).send({message:'User not found'} )
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return reply.status(401).send({message:'Invalid user or password'});
            }

            const token = server.jwt.sign({ username: user.username, userId: user._id });
            return reply.send({ message: 'Login successful', token, user: {username: user.username, email: user.email}});
        } catch (error: any) {
            return reply.status(500).send({ error: 'Failed to login!', message: error.message });
        }
    });

    // PUT for password update
    server.put('/users/update-password', { preHandler: [server.authenticate] }, async (request, reply) => {
        const { username, oldPassword, newPassword } = request.body as { username: string, oldPassword: string, newPassword: string }
        try {
            const user = await db.collection('users').findOne({ username });
            if (!user) {
                return reply.status(400).send({ error: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return reply.status(400).send({ error: 'Old password is incorrect' });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await db.collection('users').updateOne({ username }, { $set: { password: hashedNewPassword } });
            return { message: 'Password update successfully!' };
        } catch (error: any) {
            reply.status(500).send({ error: 'Failed to update password', message: error.message });
        }
    });

    // PUT for email update
    server.put('/users/update-email', { preHandler: [server.authenticate] }, async (request, reply) => {
        const { username, newEmail } = request.body as { username: string, newEmail: string };
        try {
            const user = await db.collection('users').findOne({ username });
            if (!user) {
                return reply.status(400).send({ error: 'User not found' });
            }
            await db.collection('users').updateOne({ username }, { $set: { email: newEmail } });
            return { message: 'Email updated successfully!' };
        } catch (error: any) {
            reply.status(500).send({ error: 'Failed to update email', message: error.message });
        }
    });

    // PUT for username update
    server.put('/users/update-username', { preHandler: [server.authenticate] }, async (request, reply) => {
        const { oldUsername, newUsername } = request.body as { oldUsername: string, newUsername: string };
        try {
            const existingUser = await db.collection('users').findOne({ username: newUsername  });
            if (existingUser) {
                return reply.status(400).send({ error: 'New username already exists' });
            }
            const result = await db.collection('users').updateOne({ username: oldUsername }, { $set: { username: newUsername } });
            if (result.matchedCount === 0) {
                return reply.status(404).send({ error: 'Old username not found' });
            }
            return { message: 'Username updated successfully!' }
        } catch (error: any) {
            reply.status(500).send({ error: 'Failed to update username', message: error.message});
        }
    });
}