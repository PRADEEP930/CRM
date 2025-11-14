require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function debugRoutes() {
  console.log('🔍 Debugging Routes...\n');
  
  // Test all possible routes
  const routes = [
    '/',
    '/api/health',
    '/api/auth/login', 
    '/api/auth/register',
    '/api/leads',
    '/api/leads/123'
  ];

  for (const route of routes) {
    try {
      const url = `http://localhost:5000${route}`;
      const response = await axios.get(url);
      console.log(`✅ ${route} - ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(`📡 ${route} - ${error.response.status} (${error.response.data.message || 'No message'})`);
      } else {
        console.log(`❌ ${route} - ${error.message}`);
      }
    }
  }
}

debugRoutes();