import { Client, neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const dbUrl = "postgresql://neondb_owner:npg_mJspd9jiOQL1@ep-wandering-dust-aot761v5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  console.log('Connecting to Neon Tech Serverless Postgres...');
  const client = new Client(dbUrl);

  try {
    await client.connect();
    console.log('✅ Connection established with Neon Tech!');

    // 1. Check if contacts table exists
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'contacts';
    `);

    if (res.rows.length === 0) {
      console.log('Running neon/schema.sql migration to create tables & seed data...');
      const schemaSql = fs.readFileSync(path.join(process.cwd(), 'neon', 'schema.sql'), 'utf8');
      await client.query(schemaSql);
      console.log('✅ All tables, triggers, indexes, and seed records created successfully in Neon!');
    } else {
      console.log('✅ Tables already exist in Neon database.');
    }

    // 2. Query data
    const contactsRes = await client.query('SELECT count(*) as count FROM contacts;');
    const invoicesRes = await client.query('SELECT count(*) as count FROM invoices;');
    const expensesRes = await client.query('SELECT count(*) as count FROM expenses;');

    console.log(`\n🎉 NEON DATABASE STATS:`);
    console.log(`- Contacts / Leads: ${contactsRes.rows[0].count} records`);
    console.log(`- Invoices: ${invoicesRes.rows[0].count} records`);
    console.log(`- Expenses: ${expensesRes.rows[0].count} records`);

    await client.end();
  } catch (err) {
    console.error('❌ Error executing query:', err);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

main();
