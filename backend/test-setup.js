require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function setupTestUser() {
  try {
    console.log('👤 Setting up test user...\n');

    const uniqueEmail = `test${Date.now()}@crm.com`;

    // Register new user
    console.log('1. Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: uniqueEmail,
      password: 'test123',
      name: 'Test User'
    });

    console.log('✅ User registered successfully!');
    console.log('Email:', uniqueEmail);
    console.log('Password: test123');
    console.log('Token:', registerResponse.data.token);
    console.log('');

    return {
      email: uniqueEmail,
      password: 'test123',
      token: registerResponse.data.token
    };

  } catch (error) {
    console.log('❌ Setup failed:');
    console.log('Message:', error.response?.data?.message || error.message);
  }
}

setupTestUser();