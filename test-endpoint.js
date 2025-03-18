const https = require('https');

const options = {
  hostname: 'performance-meter-render.onrender.com',
  path: '/api/consultants',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoibWFhcnRlbi5qYW5zZW5AdG90aGVwb2ludGNvbXBhbnkubmwiLCJpYXQiOjE3NDIzMjg4MjIsImV4cCI6MTc0MjQxNTIyMn0.v9aHeuB9rbEAN5qzyb_BOlf2Y-TmNgz23pz8xe1RYjE',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

console.log('Starting test script...');
console.log('Request options:', JSON.stringify(options, null, 2));

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response headers:', res.headers);
    console.log('Response body:', data);
    
    try {
      const parsedData = JSON.parse(data);
      console.log('Parsed response:', parsedData);
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end(); 