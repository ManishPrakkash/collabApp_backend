# Setting Up Neon.tech PostgreSQL for Your Project Management Platform

This guide will help yo## Troubleshooting

1. **Connection Issues**: Make sure you added `?sslmode=require` to the end of your connection string
2. **Migration Errors**: Check that your Prisma schema is compatible with PostgreSQL 15
3. **PostgreSQL Version**: Neon.tech uses PostgreSQL 15, which supports all features used in your schema
4. **Authentication Problems**:
   - If you enabled Neon Auth, ensure you're using the exact connection string provided
   - Check that your IP address isn't blocked (Neon Dashboard → Project Settings → Network Access)
   - Verify your password doesn't contain special characters that need URL encoding
5. **Timeout Errors**: Consider configuring connection pooling in your schema.prisma:up a free Neon.tech PostgreSQL database that's perfectly compatible with your existing backend code.

> **PostgreSQL Version**: Neon.tech currently uses **PostgreSQL 15** (as of October 2025). This is fully compatible with your Prisma ORM setup and existing schema.

## Step 1: Create a Neon.tech Account

1. Go to https://neon.tech/
2. Sign up using GitHub, Google, or email
3. Verify your email if needed
4. When prompted for "Cloud Service Provider", select **AWS** (Amazon Web Services)
5. For "Enable Neon Auth", select **Yes** to enable enhanced security

## Step 2: Create a New Project

1. Click "New Project"
2. Name: `project-management-platform`
3. Region: Choose closest to you or your users (AWS regions like `us-east-1` or `eu-west-1`)
4. For "PostgreSQL version", select **PostgreSQL 15** (should be default)
5. Under "Project settings":
   - Enable "Neon Auth" (provides enhanced security)
   - Use "Single Database" (included in free tier)
6. Click "Create Project"

## Step 3: Get Connection Details

After creating the project, you'll see the connection details:

1. In the Neon dashboard, select your new project
2. Click on "Connection Details" in the sidebar
3. Under "Connection string":
   - Select "Prisma" from the dropdown (optimized for Prisma ORM)
   - Choose your database name (default is `neondb`)
   - The role should be set to your default user
4. Your connection string will look like: 
   ```
   postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require&pgbouncer=true
   ```
5. Click "Copy" to copy the full connection string with proper authentication included

## Step 4: Update Your Environment Variables

Create or update your `.env` file in the backend directory with the following values:

```
# Database - Neon.tech Connection
DATABASE_URL="your-neon-connection-string-here?sslmode=require"

# JWT (Generate a secure random string)
JWT_SECRET="generated-jwt-secret-here"

# Email (Resend/SMTP)
EMAIL_FROM="noreply@yourdomain.com"
RESEND_API_KEY="your-resend-api-key"

# Stripe (Use test keys for development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
FRONTEND_URL="http://localhost:3000"

# Server
PORT=4000
```

## Step 5: Generate JWT Secret

Run this command in your terminal to generate a secure JWT secret:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your JWT_SECRET value.

## Step 6: Initialize Your Database

Run the following commands in your terminal:

```
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

## Step 7: Test Your Connection

Start your backend server to test the connection:

```
npm run dev
```

If everything is set up correctly, your backend should connect to the Neon.tech database successfully.

## Troubleshooting

1. **Connection Issues**: Make sure you added `?sslmode=require` to the end of your connection string
2. **Migration Errors**: Check that your Prisma schema is compatible with PostgreSQL 15 (Neon's current version)
3. **PostgreSQL Version**: Neon.tech uses PostgreSQL 15, which supports all features used in your schema
4. **Timeout Errors**: Consider configuring connection pooling in your schema.prisma:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: For improved performance
}
```

## Additional Configuration for Production

For production environments, consider adding these environment variables:

```
NODE_ENV="production"
FRONTEND_URL="https://your-production-domain.com"
DATABASE_CONNECTION_LIMIT=5
```

## Understanding Neon.tech Settings

### Cloud Service Provider
Neon uses AWS (Amazon Web Services) as its underlying cloud provider. When creating your account, you'll select AWS as your provider - this determines where your database is physically hosted. The free tier includes access to all AWS regions.

### Neon Auth
Neon Auth is an enhanced security feature that:
1. Provides more secure authentication for database connections
2. Enables IP allowlisting for additional security
3. Supports token-based authentication (useful for serverless environments)
4. Includes audit logging for connection attempts

It's recommended to enable Neon Auth, especially if you plan to deploy your application to production. The free tier fully supports this feature.