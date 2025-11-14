require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

async function testLeads() {
  try {
    console.log('📋 Testing Lead Management...\n');

    // 1. First, login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test1763120133029@crm.com',
      password: 'password123'
    });

    authToken = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user.email);
    console.log('Token length:', authToken.length);
    console.log('');

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };

    // 2. Test if we can access leads first
    console.log('2. Testing leads access...');
    try {
      const leadsTest = await axios.get(`${BASE_URL}/leads`, { headers });
      console.log('✅ Leads access successful!');
      console.log('Total leads:', leadsTest.data.count);
    } catch (error) {
      console.log('❌ Leads access failed:');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      return;
    }
    console.log('');

    // 3. Create a new lead
    console.log('3. Creating a new lead...');
    try {
      const createResponse = await axios.post(`${BASE_URL}/leads`, {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        company: 'Acme Inc',
        status: 'NEW',
        source: 'Website',
        notes: 'Interested in our premium plan'
      }, { headers });

      console.log('✅ Lead created successfully!');
      console.log('Lead ID:', createResponse.data.lead.id);
      console.log('Lead Name:', createResponse.data.lead.name);
      const leadId = createResponse.data.lead.id;
      console.log('');

      // 4. Get single lead
      console.log('4. Getting single lead...');
      const leadResponse = await axios.get(`${BASE_URL}/leads/${leadId}`, { headers });
      console.log('✅ Lead fetched successfully!');
      console.log('Lead:', leadResponse.data.lead.name);
      console.log('Status:', leadResponse.data.lead.status);
      console.log('');

      // 5. Update lead
      console.log('5. Updating lead...');
      const updateResponse = await axios.put(`${BASE_URL}/leads/${leadId}`, {
        status: 'CONTACTED',
        notes: 'Contacted via phone, scheduled follow-up'
      }, { headers });

      console.log('✅ Lead updated successfully!');
      console.log('New status:', updateResponse.data.lead.status);
      console.log('');

      console.log('🎉 All lead tests completed successfully!');

    } catch (error) {
      console.log('❌ Lead operation failed:');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('Message:', error.response?.data?.message);
    }

  } catch (error) {
    console.log('❌ Authentication failed:');
    console.log('Message:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testLeads();