const { sequelize } = require('./models');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Create tables using raw SQL
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        role VARCHAR(20) NOT NULL DEFAULT 'attendant',
        two_fa_enabled BOOLEAN DEFAULT false,
        two_fa_secret VARCHAR(255),
        backup_codes TEXT,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        current_quantity DECIMAL(10,2) DEFAULT 0,
        reorder_level DECIMAL(10,2) DEFAULT 0,
        current_price DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS shifts (
        shift_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        opening_cash DECIMAL(10,2) DEFAULT 0,
        closing_cash DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'open',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sales (
        sale_id SERIAL PRIMARY KEY,
        shift_id INTEGER REFERENCES shifts(shift_id),
        user_id INTEGER REFERENCES users(user_id),
        product_id INTEGER REFERENCES products(product_id),
        quantity DECIMAL(10,2) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        sale_type VARCHAR(20) DEFAULT 'cash',
        customer_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS credit_customers (
        customer_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        credit_limit DECIMAL(10,2) DEFAULT 0,
        current_balance DECIMAL(10,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS credit_transactions (
        transaction_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES credit_customers(customer_id),
        sale_id INTEGER REFERENCES sales(sale_id),
        transaction_type VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        balance_after DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS expenses (
        expense_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        expense_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS deliveries (
        delivery_id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(product_id),
        quantity DECIMAL(10,2) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_cost DECIMAL(10,2) NOT NULL,
        supplier VARCHAR(100),
        delivery_date DATE NOT NULL,
        received_by INTEGER REFERENCES users(user_id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventories (
        inventory_id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(product_id),
        quantity_change DECIMAL(10,2) NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        reference_id INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS price_histories (
        history_id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(product_id),
        old_price DECIMAL(10,2) NOT NULL,
        new_price DECIMAL(10,2) NOT NULL,
        changed_by INTEGER REFERENCES users(user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        log_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_backups (
        backup_id SERIAL PRIMARY KEY,
        backup_path VARCHAR(255) NOT NULL,
        backup_size BIGINT,
        status VARCHAR(20) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables created');

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const [users] = await sequelize.query(
      "SELECT * FROM users WHERE username = 'simon' LIMIT 1"
    );
    
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await sequelize.query(
        `INSERT INTO users (username, password_hash, first_name, last_name, role, is_active, created_at) 
         VALUES ('simon', :password, 'Simon', 'Admin', 'admin', true, NOW())`,
        { replacements: { password: hashedPassword } }
      );
      console.log('✅ Default admin user created: simon / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't exit on error, let server try to start anyway
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
} else {
  module.exports = initDatabase;
}
