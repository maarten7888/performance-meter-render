const axios = require('axios');

const API_URL = 'https://performance-meter-render-6i1b.onrender.com';

async function testDiagnostics() {
  try {
    console.log('Testing diagnostics endpoint...');
    
    console.log('\nTesting /all-routes endpoint...');
    try {
      const response = await axios.get(`${API_URL}/all-routes`);
      console.log('Diagnostics response status:', response.status);
      console.log('Diagnostics environment:', response.data.environment);
      console.log('Direct routes:', response.data.routes.filter(r => r.type === 'direct').map(r => r.path));
      console.log('Router routes count:', response.data.routes.filter(r => r.type === 'router').length);
      console.log('Middleware count:', response.data.routes.filter(r => r.type === 'middleware').length);
    } catch (error) {
      console.error('Diagnostics error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
    console.log('\nTesting /api/mock/users endpoint...');
    try {
      const response = await axios.get(`${API_URL}/api/mock/users`);
      console.log('Mock users response status:', response.status);
      console.log('Mock users data:', response.data);
    } catch (error) {
      console.error('Mock users error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('General error:', error.message);
  }
}

testDiagnostics(); 