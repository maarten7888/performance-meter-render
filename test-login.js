const https = require('https');

console.log('Starting login test...');

const data = JSON.stringify({
  email: 'maarten.jansen@tothepointcompany.nl',
  password: 'Maarten88'
});

const options = {
  hostname: 'performance-meter-render-6i1b.onrender.com',
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing POST /api/auth/login endpoint...');
console.log('Request options:', JSON.stringify(options, null, 2));
console.log('Request body:', data);

const req = https.request(options, (res) => {
  console.log('Response received');
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';

  res.on('data', (chunk) => {
    console.log('Received data chunk');
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response completed');
    console.log('Response body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed JSON response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Could not parse response as JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(data);
req.end();
console.log('Request sent'); 