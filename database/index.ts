import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

config({ path: '.env' }); // or .env.local

// Use DATABASE_URL for the connection string, not NEXT_PUBLIC_SUPABASE_URL
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });
