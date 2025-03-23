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

// Interface voor de data zoals die in de database wordt opgeslagen
export interface ConsultantProfileDB {
  email: string;
  full_name?: string;
  phone_number?: string;
  location?: string;
  bio?: string;
  skills: string; // JSON string
  languages: string; // JSON string
  hobbies?: string; // JSON string
  work_experience: string; // JSON string
  education: string; // JSON string
  certifications: string; // JSON string
  created_at?: Date;
  updated_at?: Date;
}

// Interface voor de data zoals die in de frontend wordt gebruikt
export interface ConsultantProfile {
  email: string;
  full_name?: string;
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
  newSkill?: string;
  newLanguage?: string;
  newCertification?: string;
}

export interface ConsultantProfileFormData extends Omit<ConsultantProfile, 'created_at' | 'updated_at'> {} 