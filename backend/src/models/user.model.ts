export interface User {
    userID?: string;
    nume?: string;
    prenume: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt?: Date;
}  