// This file configures Prisma for Neon PostgreSQL 15
// Add this to the root of your backend directory and use with "prisma.config.js"

/**
 * @type {import('@prisma/client').PrismaClientOptions}
 */
const config = {
  datasources: {
    db: {
      // Connection pooling configuration optimized for Neon PostgreSQL 15
      poolConfig: {
        min: 1,
        max: 5
      }
    }
  },
  // Log settings for development (comment out in production)
  log: [
    {
      emit: 'event',
      level: 'query',
    }
  ],
  // Optimize connection for serverless/edge environments like Neon
  engineConfig: {
    // Use connection pooling
    connectionPooling: true
  }
};

module.exports = config;