export interface User {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired';
    consultantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TimeEntry {
    id: string;
    projectId: string;
    userId: string;
    date: string;
    hours: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
} 