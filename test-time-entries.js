const https = require('https');

const options = {
  hostname: 'performance-meter-render-6i1b.onrender.com',
  path: '/api/time-entries',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoibWFhcnRlbi5qYW5zZW5AdG90aGVwb2ludGNvbXBhbnkubmwiLCJpYXQiOjE3NDIzMjI5NzAsImV4cCI6MTc0MjQwOTM3MH0.MobCWHmw2kM6annCrWhHT0AL__645cQuaj6u6OuDgyY',
    'Content-Type': 'application/json'
  }
};

console.log('Testing GET /api/time-entries endpoint...');
console.log('Request options:', options);

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end(); 