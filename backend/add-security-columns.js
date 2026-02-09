const { Pool } = require('pg');
require('dotenv').config();

async function addSecurityColumns() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔧 Adding security columns to users table...');

    // Check if columns already exist
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('failed_login_attempts', 'account_locked_until', 'last_failed_login', 'password_changed_at', 'token_version', 'backup_codes')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);
    console.log('Existing columns:', existingColumns);

    // Add missing columns
    const columnsToAdd = [
      {
        name: 'failed_login_attempts',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0 NOT NULL'
      },
      {
        name: 'account_locked_until',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP'
      },
      {
        name: 'last_failed_login',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP'
      },
      {
        name: 'password_changed_at',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
      },
      {
        name: 'token_version',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER DEFAULT 0 NOT NULL'
      },
      {
        name: 'backup_codes',
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT'
      }
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adding column: ${column.name}`);
        await pool.query(column.sql);
        console.log(`✅ Added ${column.name}`);
      } else {
        console.log(`⏭️  Column ${column.name} already exists`);
      }
    }

    console.log('✅ All security columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding security columns:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  addSecurityColumns()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addSecurityColumns;
