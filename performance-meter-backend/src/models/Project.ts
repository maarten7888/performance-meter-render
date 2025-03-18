import { pool } from '../config/database';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectInput {
  name: string;
  description?: string;
  userId: number;
}

export interface ProjectOutput extends Required<Project> {}

export async function createProject(input: ProjectInput): Promise<ProjectOutput> {
  const [result] = await pool.query(
    'INSERT INTO projects (name, description, userId) VALUES (?, ?, ?)',
    [input.name, input.description, input.userId]
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

export async function findProjectById(id: number): Promise<ProjectOutput | null> {
  const [projects] = await pool.query(
    'SELECT * FROM projects WHERE id = ?',
    [id]
  );
  
  return (projects as any[])[0] || null;
}

export async function findProjectsByUserId(userId: number): Promise<ProjectOutput[]> {
  const [projects] = await pool.query(
    'SELECT * FROM projects WHERE userId = ?',
    [userId]
  );
  
  return projects as ProjectOutput[];
}

export async function updateProject(id: number, input: Partial<ProjectInput>): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (input.name !== undefined) {
    updates.push('name = ?');
    values.push(input.name);
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
    `UPDATE projects SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ?`,
    values
  );
}

export async function deleteProject(id: number): Promise<void> {
  await pool.query(
    'DELETE FROM projects WHERE id = ?',
    [id]
  );
} 