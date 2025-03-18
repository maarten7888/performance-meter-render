import { pool } from '../config/database';

export interface TimeEntry {
  id: number;
  userId: number;
  projectId: number;
  date: Date;
  hours: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntryInput {
  userId: number;
  projectId: number;
  date: Date;
  hours: number;
  description?: string;
}

export interface TimeEntryOutput extends Required<TimeEntry> {}

export async function createTimeEntry(input: TimeEntryInput): Promise<TimeEntryOutput> {
  const [result] = await pool.query(
    'INSERT INTO time_entries (userId, projectId, date, hours, description) VALUES (?, ?, ?, ?, ?)',
    [input.userId, input.projectId, input.date, input.hours, input.description]
  );
  
  const id = (result as any).insertId;
  return {
    id,
    ...input,
    description: input.description || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function findTimeEntryById(id: number): Promise<TimeEntryOutput | null> {
  const [entries] = await pool.query(
    'SELECT * FROM time_entries WHERE id = ?',
    [id]
  );
  
  return (entries as any[])[0] || null;
}

export async function findTimeEntriesByUserId(userId: number): Promise<TimeEntryOutput[]> {
  const [entries] = await pool.query(
    'SELECT * FROM time_entries WHERE userId = ?',
    [userId]
  );
  
  return entries as TimeEntryOutput[];
}

export async function findTimeEntriesByProjectId(projectId: number): Promise<TimeEntryOutput[]> {
  const [entries] = await pool.query(
    'SELECT * FROM time_entries WHERE projectId = ?',
    [projectId]
  );
  
  return entries as TimeEntryOutput[];
}

export async function updateTimeEntry(id: number, input: Partial<TimeEntryInput>): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (input.date !== undefined) {
    updates.push('date = ?');
    values.push(input.date);
  }
  
  if (input.hours !== undefined) {
    updates.push('hours = ?');
    values.push(input.hours);
  }
  
  if (input.description !== undefined) {
    updates.push('description = ?');
    values.push(input.description);
  }
  
  if (updates.length === 0) {
    return;
  }
  
  values.push(id);
  
  await pool.query(
    `UPDATE time_entries SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ?`,
    values
  );
}

export async function deleteTimeEntry(id: number): Promise<void> {
  await pool.query(
    'DELETE FROM time_entries WHERE id = ?',
    [id]
  );
} 