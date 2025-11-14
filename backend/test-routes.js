// test-routes.js
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRoutes() {
  try {
    console.log('🔍 Testing Route Registration...\n');

    // Test health route (should always work)
    console.log('1. Testing health route...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health route working:', healthResponse.data.message);
    console.log('');

    // Test if leads route exists (without auth)
    console.log('2. Testing leads route existence...');
    try {
      await axios.get(`${BASE_URL}/leads`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Leads route exists! (Got 401 - Authentication required)');
      } else if (error.response?.status === 404) {
        console.log('❌ Leads route NOT FOUND (404)');
      } else {
        console.log('📡 Leads route responded with:', error.response?.status);
      }
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testRoutes();