import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://performance-meter-render-6i1b.onrender.com/api';
const TEST_TOKEN = process.env.TEST_TOKEN;

if (!TEST_TOKEN) {
  console.error('TEST_TOKEN is niet geconfigureerd in .env');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TEST_TOKEN}`
};

async function testProjectEndpoints() {
  try {
    console.log('=== Start Project Endpoint Tests ===\n');

    // Test 1: Ophalen van alle projecten
    console.log('Test 1: GET /projects');
    const projectsResponse = await axios.get(`${API_URL}/projects`, { headers });
    console.log('Status:', projectsResponse.status);
    console.log('Aantal projecten:', projectsResponse.data.length);
    console.log('Response:', JSON.stringify(projectsResponse.data, null, 2));
    console.log('\n');

    // Test 2: Ophalen van een specifiek project
    console.log('Test 2: GET /projects/:id');
    const projectId = projectsResponse.data[0]?.id;
    if (projectId) {
      const projectResponse = await axios.get(`${API_URL}/projects/${projectId}`, { headers });
      console.log('Status:', projectResponse.status);
      console.log('Response:', JSON.stringify(projectResponse.data, null, 2));
    } else {
      console.log('Geen project ID gevonden om te testen');
    }
    console.log('\n');

    // Test 3: Verwijderen van een project
    console.log('Test 3: DELETE /projects/:id');
    if (projectId) {
      const deleteResponse = await axios.delete(`${API_URL}/projects/${projectId}`, { headers });
      console.log('Status:', deleteResponse.status);
      console.log('Response:', JSON.stringify(deleteResponse.data, null, 2));
    } else {
      console.log('Geen project ID gevonden om te verwijderen');
    }
    console.log('\n');

    console.log('=== Project Endpoint Tests Voltooid ===');
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Test Error:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    } else {
      console.error('Onverwachte fout:', error);
    }
  }
}

testProjectEndpoints(); 