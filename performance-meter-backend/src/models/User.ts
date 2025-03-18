import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password: string;
  yearlyTarget?: number;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper functie voor wachtwoord validatie
export async function validatePassword(hashedPassword: string, password: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Helper functie voor wachtwoord hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
} 