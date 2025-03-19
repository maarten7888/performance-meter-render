const axios = require('axios');

const testEndpoint = async () => {
  try {
    console.log('Starting test script...');
    console.log('Testing endpoint: / (health check)');

    const response = await axios.get('https://performance-meter-render-6i1b.onrender.com/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Status Code:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : error.message);
  }
};

testEndpoint(); 