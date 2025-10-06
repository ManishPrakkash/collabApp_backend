// Script to initialize the Neon.tech cloud database for Project Management Platform
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('\n🚀 Setting up Neon.tech cloud database for Project Management Platform...\n');
  
  // Change directory to backend
  const backendDir = path.join(__dirname, 'backend');
  process.chdir(backendDir);
  
  // Check if .env exists, if not, create from example
  if (!fs.existsSync(path.join(backendDir, '.env'))) {
    console.log('Creating .env file from template...');
    if (fs.existsSync(path.join(backendDir, '.env.example'))) {
      fs.copyFileSync(path.join(backendDir, '.env.example'), path.join(backendDir, '.env'));
    } else {
      console.log('⚠️ Warning: No .env.example file found. Creating basic .env file.');
      fs.writeFileSync(path.join(backendDir, '.env'), '# Database\nDATABASE_URL=""\n\n# JWT\nJWT_SECRET=""\n');
    }
  }
  
  // Generate JWT secret if needed
  const envContent = fs.readFileSync(path.join(backendDir, '.env'), 'utf8');
  if (!envContent.includes('JWT_SECRET=') || envContent.includes('JWT_SECRET=""')) {
    console.log('Generating secure JWT secret...');
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    const updatedEnvContent = envContent.replace(/JWT_SECRET=".*"/g, `JWT_SECRET="${jwtSecret}"`);
    fs.writeFileSync(path.join(backendDir, '.env'), updatedEnvContent);
    console.log('✅ JWT secret generated and added to .env');
  }
  
  // Get Neon.tech connection string
  let connectionString = '';
  const match = envContent.match(/DATABASE_URL="(.+?)"/);
  
  if (match && match[1].includes('neon.tech')) {
    connectionString = match[1];
    console.log('Found existing Neon.tech connection string in .env');
  } else {
    console.log('\n📝 Please enter your Neon.tech connection details:');
    console.log('  (Find this in Neon Dashboard → Connection Details → Select "Prisma" format)');
    connectionString = await question('Paste your full Neon.tech connection string: ');
    
    // Ensure connection string has required parameters
    if (!connectionString.includes('sslmode=require')) {
      connectionString += connectionString.includes('?') ? 
        '&sslmode=require' : '?sslmode=require';
    }
    
    // Check if using Neon Auth and add additional parameters if needed
    const isUsingNeonAuth = await question('Did you enable Neon Auth? (y/n): ');
    if (isUsingNeonAuth.toLowerCase().startsWith('y')) {
      console.log('Ensuring connection string is configured for Neon Auth...');
      if (!connectionString.includes('pgbouncer=true')) {
        connectionString += '&pgbouncer=true';
      }
    }
    
    // Update .env file with new connection string
    const updatedEnvContent = envContent.replace(/DATABASE_URL=".*"/g, `DATABASE_URL="${connectionString}"`);
    fs.writeFileSync(path.join(backendDir, '.env'), updatedEnvContent);
    console.log('✅ Connection string updated in .env file');
  }
  
  try {
    // Install dependencies if needed
    if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
      console.log('\n📦 Installing dependencies...');
      execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    }
    
    console.log('\n🔨 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('\n⬆️ Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('\n🌱 Seeding database with initial data...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    
    console.log('\n✅ Database setup complete!');
    console.log('\n📊 Testing database connection...');
    
    // Test the database connection
    execSync('npx prisma db pull', { stdio: 'inherit' });
    
    console.log('\n🎉 Success! Your Neon.tech database is configured and ready to use.');
    console.log('\n📊 Database Information:');
    console.log('- PostgreSQL Version: 15 (Neon.tech\'s current version)');
    console.log('- Prisma Client: @prisma/client v6.6.0');
    console.log('- SSL Mode: Enabled (required for Neon.tech)');
    
    console.log('\nYou can now start your backend with: cd backend && npm run dev');
    console.log('And your frontend with: cd frontend && npm run dev');
    
  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Make sure your Neon.tech connection string is correct');
    console.log('2. Check that you\'ve added ?sslmode=require to the connection string');
    console.log('3. Verify your IP address isn\'t blocked by any firewalls');
    console.log('4. Ensure the database user has the necessary permissions');
    console.log('5. Neon.tech uses PostgreSQL 15, which is compatible with your Prisma setup');
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();