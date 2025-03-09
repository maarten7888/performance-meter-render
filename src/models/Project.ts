import { RowDataPacket } from 'mysql2';

export interface Project extends RowDataPacket {
  id: number;
  name: string;
  hourly_rate: number;
  start_date: Date;
  end_date: Date;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectInput {
  name: string;
  hourly_rate: number;
  start_date: Date;
  end_date: Date;
  user_id: number;
} 