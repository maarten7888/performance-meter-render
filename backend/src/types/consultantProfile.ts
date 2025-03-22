export interface ConsultantProfile {
    email: string;
    fullName: string;
    title?: string;
    bio?: string;
    strengths?: string[];
    hobbies?: string[];
    experience?: string[];
    education?: string[];
    certifications?: string[];
    profileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ConsultantProfileInput extends Omit<ConsultantProfile, 'createdAt' | 'updatedAt'> {} 