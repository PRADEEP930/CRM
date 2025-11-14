require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Generate unique email
const uniqueEmail = `test${Date.now()}@crm.com`;

async function testAuth() {
  try {
    console.log('🔐 Testing Authentication...\n');
    console.log('Using email:', uniqueEmail);

    // 1. Register a new user
    console.log('1. Registering user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: uniqueEmail,
      password: 'password123',
      name: 'Test User'
    });

    console.log('✅ Registration successful!');
    console.log('Token:', registerResponse.data.token);
    
    const token = registerResponse.data.token;

    // 2. Test protected route
    console.log('2. Testing protected route...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Profile access successful!');
    console.log('User:', profileResponse.data.user.email);

    // 3. Test login
    console.log('3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: uniqueEmail,
      password: 'password123'
    });

    console.log('✅ Login successful!');

  } catch (error) {
    console.log('❌ Error details:');
    console.log('Message:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testAuth();