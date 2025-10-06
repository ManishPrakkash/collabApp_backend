# Testing Your Neon.tech Database Connection

This guide will help you test the connection to your Neon.tech database and initialize it for use with the Project Management Platform.

## 1. Test Connection with PSQL

If you have the PostgreSQL client (`psql`) installed, you can directly connect to your Neon database using this command:

```bash
psql 'postgresql://neondb_owner:npg_D0HghtOGUXM9@ep-ancient-moon-a1y9tv8o-pooler.ap-southeast-1.aws.neon.tech/project_management_db?sslmode=require&channel_binding=require'
```

You should see a PostgreSQL prompt like `project_management_db=>` if the connection is successful.

## 2. Initialize Database with Prisma

Run these commands to initialize your database with the Prisma schema:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

## 3. Verify Tables Were Created

Connect to your database again and run:

```sql
\dt
```

You should see all the tables defined in your schema (User, Project, Task, etc.).

## 4. Start Your Backend Server

```bash
cd backend
npm run dev
```

## 5. Common Issues & Solutions

- **Connection Errors**: Make sure your IP is allowed in Neon dashboard (Project Settings > Network Access)
- **SSL Errors**: Ensure `sslmode=require` is in your connection string
- **Authentication Errors**: Double-check your credentials in the connection string
- **Migration Errors**: If tables already exist, you may need to use `npx prisma migrate reset` first

### Can't Reach Database Server (P1001)

If you see `Error: P1001: Can't reach database server`, try these solutions:

1. **Use Non-Pooler Endpoint**: For migrations, use the direct endpoint (remove `-pooler` from the hostname)
   ```
   # Change this:
   postgresql://user:pass@ep-name-pooler.region.aws.neon.tech/dbname
   
   # To this:
   postgresql://user:pass@ep-name.region.aws.neon.tech/dbname
   ```

2. **Allow Your IP**: Go to Neon Dashboard → Project Settings → Network Access and add your IP

3. **Simplify Connection String**: Try removing parameters except `sslmode=require`:
   ```
   postgresql://user:pass@ep-name.region.aws.neon.tech/dbname?sslmode=require
   ```

4. **Check Firewall**: Ensure your firewall allows outgoing connections on port 5432

## 6. Adjust Connection Parameters (if needed)

If you encounter issues with connection pooling or need to optimize for production:

```
DATABASE_URL="postgresql://neondb_owner:npg_D0HghtOGUXM9@ep-ancient-moon-a1y9tv8o-pooler.ap-southeast-1.aws.neon.tech/project_management_db?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=10"
```

This adds connection pooling and a connection timeout setting.