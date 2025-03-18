const jwt = require('jsonwebtoken');
require('dotenv').config();

const payload = {
  userId: 2,
  email: 'maarten.jansen@tothepointcompany.nl'
};

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '24h'
});

console.log('Generated token:', token); 