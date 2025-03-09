import { RowDataPacket } from 'mysql2';

export interface TimeEntry extends RowDataPacket {
  id: number;
  project_id: number;
  user_id: number;
  hours: number;
  entry_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TimeEntryInput {
  project_id: number;
  user_id: number;
  hours: number;
  entry_date: Date;
} 