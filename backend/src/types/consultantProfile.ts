export interface WorkExperience {
    company: string;
    position: string;
    period: string;
}

export interface Education {
    school: string;
    degree: string;
    year: string;
}

export interface ConsultantProfile {
    email: string;
    full_name: string;
    phone_number?: string;
    location?: string;
    bio?: string;
    skills: string[];
    languages: string[];
    hobbies?: string[];
    work_experience: WorkExperience[];
    education: Education[];
    certifications: string[];
    created_at?: Date;
    updated_at?: Date;
}

export interface ConsultantProfileInput extends Omit<ConsultantProfile, 'created_at' | 'updated_at'> {} 