require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function quickTest() {
  try {
    console.log('🚀 Quick Lead Test...\n');

    // Login
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test1763121995797@crm.com',
      password: 'test123'
    });

    const token = login.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('✅ Logged in');

    // Create lead
    const create = await axios.post(`${BASE_URL}/leads`, {
      name: 'Quick Test Lead',
      email: 'quick@test.com',
      company: 'Test Corp'
    }, { headers });

    console.log('✅ Lead created:', create.data.lead.id);

    // Get leads
    const leads = await axios.get(`${BASE_URL}/leads`, { headers });
    console.log('✅ Leads fetched:', leads.data.leads.length);

    console.log('🎉 Backend working! Ready for frontend.');

  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

quickTest();