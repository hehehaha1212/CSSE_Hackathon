const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a pool for database setup
const setupPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function setupDatabase() {
  const client = await setupPool.connect();
  
  try {
    console.log('🚀 Setting up Carbon Footprint Tracker database...');
    
    // Check if database exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'carbon_tracker']
    );
    
    if (dbExists.rows.length === 0) {
      console.log('📦 Creating database...');
      await client.query(
        `CREATE DATABASE ${process.env.DB_NAME || 'carbon_tracker'}`
      );
      console.log('✅ Database created successfully!');
    } else {
      console.log('✅ Database already exists!');
    }
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  } finally {
    client.release();
  }
  
  // Close the setup pool
  await setupPool.end();
  
  // Create a new pool for the actual database
  const dbPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'carbon_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });
  
  const dbClient = await dbPool.connect();
  
  try {
    console.log('📋 Creating tables...');
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await dbClient.query(schema);
    console.log('✅ Tables created successfully!');
    
    console.log('🎉 Database setup completed!');
    console.log('\n📊 Database structure:');
    console.log('├── users (user accounts and profiles)');
    console.log('├── carbon_entries (carbon footprint data)');
    console.log('├── challenges (available challenges)');
    console.log('├── user_challenges (user challenge participation)');
    console.log('├── posts (community posts)');
    console.log('├── post_likes (post likes)');
    console.log('├── post_comments (post comments)');
    console.log('├── achievements (user achievements)');
    console.log('├── user_sessions (JWT session management)');
    console.log('├── user_integrations (third-party API connections)');
    console.log('└── notifications (user notifications)');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    dbClient.release();
    await dbPool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n🎯 Ready to run the application!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase; 