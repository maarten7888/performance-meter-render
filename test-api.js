const axios = require('axios');

const API_URL = 'https://performance-meter-render-6i1b.onrender.com';

async function testEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test health check
    console.log('\nTesting health check endpoint...');
    try {
      const healthResponse = await axios.get(`${API_URL}/`);
      console.log('Health check response:', healthResponse.data);
    } catch (error) {
      console.error('Health check error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
    // Test test route
    console.log('\nTesting test endpoint...');
    try {
      const testResponse = await axios.get(`${API_URL}/api/test`);
      console.log('Test endpoint response:', testResponse.data);
    } catch (error) {
      console.error('Test endpoint error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
    // Test user management test route
    console.log('\nTesting user management test endpoint...');
    try {
      const umTestResponse = await axios.get(`${API_URL}/api/user-management/test`);
      console.log('User management test response:', umTestResponse.data);
    } catch (error) {
      console.error('User management test error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
    // Test debug routes
    console.log('\nTesting debug routes endpoint...');
    try {
      const routesResponse = await axios.get(`${API_URL}/debug/routes`);
      console.log('Debug routes response:', routesResponse.data);
    } catch (error) {
      console.error('Debug routes error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('General error:', error.message);
  }
}

testEndpoints(); 