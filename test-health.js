const https = require('https');

const options = {
  hostname: 'performance-meter-render-6i1b.onrender.com',
  path: '/',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing health check endpoint...');
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