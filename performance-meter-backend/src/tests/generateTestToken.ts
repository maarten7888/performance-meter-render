import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Test gebruiker data
const testUser = {
  id: 1,
  email: 'test@example.com',
  role: 'user'
};

// Genereer token
const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '1h' });

console.log('Test Token:');
console.log(token); 