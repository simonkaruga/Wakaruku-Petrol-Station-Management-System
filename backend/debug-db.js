// Debug script to check database configuration
require('dotenv').config();

console.log('=== Database Configuration Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) : 'NOT SET');

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Protocol:', url.protocol);
    console.log('Host:', url.hostname);
    console.log('Port:', url.port);
    console.log('Database:', url.pathname.substring(1));
    console.log('Username:', url.username);
    console.log('Password exists:', !!url.password);
  } catch (e) {
    console.error('Invalid DATABASE_URL format:', e.message);
  }
} else {
  console.log('⚠️ DATABASE_URL is not set!');
  console.log('Using fallback config:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
}

console.log('=================================');
