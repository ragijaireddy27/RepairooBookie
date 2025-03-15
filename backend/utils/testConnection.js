const { Sequelize } = require('sequelize');

// Create a Sequelize instance to connect to the database
const sequelize = new Sequelize('repairoo_bookie', 'postgres', 'ragi', {
  host: 'localhost',
  dialect: 'postgres',
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();
