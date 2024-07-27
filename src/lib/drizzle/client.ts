import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/db/schema';

config({ path: '.env' });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

export default db;
