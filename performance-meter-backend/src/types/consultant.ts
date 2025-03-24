import { RowDataPacket } from 'mysql2';

export interface Consultant {
    id: number;
    user_id: number;
    profile_image: string | null;
    role: string;
    start_date: Date;
    bio: string | null;
    skill_moves: number;
    weak_foot: number;
    stat_punctuality: number;
    stat_teamwork: number;
    stat_focus: number;
    stat_skills: number;
    stat_hours: number;
    stat_communication: number;
    created_at: Date;
    updated_at: Date;
}

export interface ConsultantWithUser extends Consultant {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface ConsultantInput {
    user_id: number;
    profile_image?: string;
    role: string;
    start_date: Date;
    bio?: string;
    skill_moves: number;
    weak_foot: number;
    stat_punctuality: number;
    stat_teamwork: number;
    stat_focus: number;
    stat_skills: number;
    stat_hours: number;
    stat_communication: number;
} 