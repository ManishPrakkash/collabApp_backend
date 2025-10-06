FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code with skipLibCheck to avoid type errors in dependencies
RUN npm run build
# If you encounter any build issues, you can use the more explicit command below instead:
# RUN npx tsc --skipLibCheck

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
