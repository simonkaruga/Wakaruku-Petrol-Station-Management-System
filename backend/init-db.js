const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables created/updated');

    // Check if admin user exists
    const { User } = require('./models');
    const adminExists = await User.findOne({ where: { username: 'simon' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'simon',
        password: hashedPassword,
        firstName: 'Simon',
        lastName: 'Admin',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created: simon / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
