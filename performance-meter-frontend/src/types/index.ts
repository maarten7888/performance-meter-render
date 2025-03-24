export interface User {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface Project {
    id: number;
    name: string;
    hourlyRate: number;
    startDate: string;
    endDate: string;
    user_id: number;
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

export interface ProjectFormData {
    name: string;
    hourlyRate: number;
    start_date: string;
    end_date: string;
} 