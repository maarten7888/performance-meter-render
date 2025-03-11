export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    yearTarget: number;
    createdAt: Date;
    updatedAt: Date;
} 