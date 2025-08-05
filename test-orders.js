// Test script to verify the orders API is working correctly
const axios = require('axios');
require('dotenv').config();

// Replace with your actual backend URL and token
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
const token = process.env.TEST_TOKEN;

if (!token) {
  console.error('Please set TEST_TOKEN environment variable with a valid authentication token');
  process.exit(1);
}

async function testMyOrders() {
  console.log('Testing my-orders endpoint...');
  
  try {
    const response = await axios.post(`${backendUrl}/api/order/my-orders`, 
      { userId: null }, // The userId should be extracted from token by middleware
      { headers: { token } }
    );
    
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success) {
      console.log('Number of orders:', response.data.orders.length);
      if (response.data.orders.length > 0) {
        console.log('First order sample:', {
          id: response.data.orders[0]._id,
          amount: response.data.orders[0].amount,
          status: response.data.orders[0].status,
          items: response.data.orders[0].items.length
        });
      } else {
        console.log('No orders found for this user');
      }
    } else {
      console.error('Error message:', response.data.message);
    }
  } catch (error) {
    console.error('Error testing my-orders endpoint:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testMyOrders();