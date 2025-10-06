FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --no-save @types/express @types/jest

COPY . .

# Make deploy-build.sh executable
RUN chmod +x deploy-build.sh

# Generate Prisma client and build with the deploy script
RUN npx prisma generate

# Try to build with our deploy script that handles multiple fallback strategies
RUN ./deploy-build.sh

# Production image
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose the port the app will run on
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/index.js"]
