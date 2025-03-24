import { RowDataPacket } from 'mysql2';

export interface Consultant extends RowDataPacket {
    id: number;
    user_id: number;
    profile_image: string | null;
    role: string;
    start_date: Date;
    bio: string | null;
    skill_moves: number | null;
    weak_foot: number | null;
    stat_punctuality: number | null;
    stat_teamwork: number | null;
    stat_focus: number | null;
    stat_skills: number | null;
    stat_hours: number | null;
    stat_communication: number | null;
    created_at: Date;
    updated_at: Date;
}

export interface ConsultantInput {
    user_id: number;
    profile_image?: string;
    role: string;
    start_date: Date;
    bio?: string;
    skill_moves?: number;
    weak_foot?: number;
    stat_punctuality?: number;
    stat_teamwork?: number;
    stat_focus?: number;
    stat_skills?: number;
    stat_hours?: number;
    stat_communication?: number;
} 