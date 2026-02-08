const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function addAliceUser() {
  try {
    console.log('Adding Alice as manager user...');
    
    // Hash password for Alice
    const alicePassword = await bcrypt.hash('alice123', 12);
    
    // Insert Alice as manager
    await pool.query(`
      INSERT INTO users (username, email, password_hash, role, is_active)
      VALUES ('alice', 'alice@wakaruku.com', $1, 'manager', true)
      ON CONFLICT (username) DO UPDATE 
      SET email = 'alice@wakaruku.com', 
          password_hash = $1, 
          role = 'manager',
          is_active = true
    `, [alicePassword]);
    
    console.log('✅ Alice user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Username: alice');
    console.log('  Password: alice123');
    console.log('  Role: Manager (Full operational rights)');
    console.log('');
    console.log('Note: You remain the admin with full system access.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAliceUser();
