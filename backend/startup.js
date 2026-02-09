#!/usr/bin/env node

const { spawn } = require('child_process');

async function startup() {
  console.log('🚀 Starting Wakaruku Backend...');
  
  // Run database initialization
  console.log('📦 Initializing database...');
  const initDb = spawn('node', ['init-db.js'], { stdio: 'inherit' });
  
  await new Promise((resolve, reject) => {
    initDb.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Database initialized successfully');
        resolve();
      } else {
        console.log('⚠️  Database initialization had issues, continuing anyway...');
        resolve(); // Continue even if init fails
      }
    });
    
    initDb.on('error', (err) => {
      console.error('❌ Failed to run init-db:', err);
      resolve(); // Continue anyway
    });
  });
  
  // Start the server
  console.log('🌐 Starting server...');
  const server = spawn('node', ['server.js'], { stdio: 'inherit' });
  
  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
}

startup();
