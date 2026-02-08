const { pool } = require('./config/database');

async function addShiftColumns() {
  try {
    console.log('Adding missing columns to shifts table...');
    
    await pool.query(`
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "shiftStartTime" TIMESTAMP;
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "petrolBuyPrice" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "petrolSellPrice" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "petrolTankStock" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "dieselBuyPrice" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "dieselSellPrice" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "dieselTankStock" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "keroseneBuyPrice" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "keroseneSellPrice" DECIMAL(10, 2);
      ALTER TABLE shifts ADD COLUMN IF NOT EXISTS "keroseneTankStock" DECIMAL(10, 2);
    `);
    
    console.log('✅ Columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addShiftColumns();
