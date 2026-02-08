const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'wakaruku_petrol_db'
});

async function addShiftColumns() {
  try {
    console.log('Adding missing columns to shifts table...');

    // Add isLocked column
    await pool.query(`
      ALTER TABLE shifts 
      ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN DEFAULT true;
    `);
    console.log('✓ Added isLocked column');

    // Add price columns
    await pool.query(`
      ALTER TABLE shifts 
      ADD COLUMN IF NOT EXISTS "petrolBuyPrice" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "petrolSellPrice" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "dieselBuyPrice" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "dieselSellPrice" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "keroseneBuyPrice" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "keroseneSellPrice" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "petrolTankStock" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "dieselTankStock" DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS "keroseneTankStock" DECIMAL(10, 2);
    `);
    console.log('✓ Added price and stock columns');

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

addShiftColumns();
