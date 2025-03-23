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
    newSkill?: string;
    newLanguage?: string;
    newCertification?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ConsultantProfileFormData extends Omit<ConsultantProfile, 'created_at' | 'updated_at'> {
    profileImage?: string;
    title?: string;
    strengths?: string[];
}

export interface ConsultantProfileDB {
    email: string;
    full_name: string;
    phone_number: string;
    location: string;
    bio: string;
    skills: string;
    languages: string;
    hobbies: string;
    work_experience: string;
    education: string;
    certifications: string;
}

export interface WorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface Education {
    institution: string;
    degree: string;
    startDate: string;
    endDate?: string;
    description?: string;
} 