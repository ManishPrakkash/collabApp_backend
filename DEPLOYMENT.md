# Project Management App Deployment Guide

This guide provides instructions for deploying the backend to Render and connecting it to a Vercel frontend deployment.

## Backend Deployment to Render

### Prerequisites

1. A [Render](https://render.com) account
2. A PostgreSQL database (can be hosted on Render, Neon.tech, or another provider)
3. Your codebase pushed to a GitHub repository

### Deployment Steps

#### Option 1: Deploy with Blueprint (Recommended)

1. Log in to Render and navigate to the Dashboard.
2. Click on the "New +" button and select "Blueprint".
3. Connect your GitHub repository that contains the backend code.
4. Render will automatically detect the `render.yaml` file and configure your service.
5. Update the required environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `FRONTEND_URL`: URL of your Vercel frontend app

#### Option 2: Manual Deployment

1. Log in to Render and navigate to the Dashboard.
2. Click on the "New +" button and select "Web Service".
3. Connect your GitHub repository that contains the backend code.
4. Configure your service with the following settings:
   - **Name**: project-management-api (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Select the appropriate plan (Free tier is fine for starting)

5. Add the following environment variables under the "Environment" section:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will automatically assign a port)
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Generate a secure random string
   - `FRONTEND_URL`: URL of your Vercel frontend app
   - `SKIP_EMAIL_VERIFICATION`: `true` (since we're skipping email verification)

6. Click "Create Web Service" to start the deployment process.

### Database Setup

1. If using Render's PostgreSQL service:
   - Click on "New +" and select "PostgreSQL".
   - Configure your database name and region.
   - After creation, copy the "External Database URL" to use as your `DATABASE_URL`.

2. If using Neon.tech (or another provider):
   - Use the connection string provided by your database provider.
   - Make sure the connection URL includes `?sslmode=require` for secure connections.

3. Run migrations on the production database after connecting:
   - You can set up a one-time script in Render to run migrations during deployment.

## Frontend Deployment to Vercel

1. Push your frontend code to GitHub.
2. Log in to [Vercel](https://vercel.com) and import your project.
3. Add the following environment variables to your Vercel project:
   - `NEXT_PUBLIC_API_URL`: The URL of your Render-deployed backend API
     (e.g., `https://project-management-api.onrender.com`)

4. Deploy your frontend application.

## Connecting the Frontend and Backend

1. Update the CORS configuration in the backend to allow requests from your Vercel frontend:
   - Ensure your backend's `FRONTEND_URL` environment variable is set to your Vercel app's URL.

2. Update the API URL in your frontend to point to your Render backend:
   - Ensure your frontend's `NEXT_PUBLIC_API_URL` environment variable is set to your Render API's URL.

## Testing the Deployment

1. Visit your Vercel frontend URL.
2. Try to register a new user or login.
3. Test basic functionality like creating projects or tasks.

## Troubleshooting

If you encounter any issues:

1. Check the logs in the Render dashboard for backend errors.
2. Verify all environment variables are set correctly.
3. Check that CORS is properly configured to allow communication between frontend and backend.
4. Ensure the database connection string is correct and accessible from the Render service.

### TypeScript Build Issues

If you encounter TypeScript compilation errors during deployment:

1. The deployment uses a special `deploy-build.sh` script that attempts multiple build strategies:
   - Standard build with `--skipLibCheck`
   - Alternative build with a stripped-down tsconfig
   - Emergency build with `--allowJs --noEmitOnError false` flags

2. You can check the build logs in Render to see which approach was used.

3. For persistent TypeScript errors:
   - Add missing type declarations for any libraries causing errors
   - Consider adding `// @ts-ignore` comments for problematic lines as a last resort
   - Verify the Jest setup is properly configured for test files

## Notes on Email Verification and Payments

This deployment has been configured to skip email verification and Stripe payment integration as requested. If you need to add these features in the future:

1. Set `SKIP_EMAIL_VERIFICATION` to `false` and configure email provider credentials.
2. Re-enable the subscription routes and Stripe webhook handling in `index.ts`.
3. Configure Stripe secret keys and webhook endpoints in your environment variables.