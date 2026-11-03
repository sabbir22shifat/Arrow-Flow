import { neon } from '@neondatabase/serverless';

const dbUrl = "postgresql://neondb_owner:npg_mJspd9jiOQL1@ep-wandering-dust-aot761v5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function verify() {
  const sql = neon(dbUrl);
  
  const leads = await sql`SELECT id, name, company, deal_value, status, service_domain FROM contacts;`;
  const invoices = await sql`SELECT invoice_no, total_amount, paid_amount, status FROM invoices;`;
  const expenses = await sql`SELECT title, category, amount FROM expenses;`;

  console.log('✅ NEON POSTGRES CONTACTS:');
  console.table(leads);

  console.log('\n✅ NEON POSTGRES INVOICES:');
  console.table(invoices);

  console.log('\n✅ NEON POSTGRES EXPENSES:');
  console.table(expenses);

  const cashCollected = invoices.reduce((s, i) => s + Number(i.paid_amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const margin = cashCollected - totalExpenses;

  console.log(`\n💰 LIVE FINANCIAL METRICS FROM NEON:`);
  console.log(`- Cash Collected: ৳ ${cashCollected.toLocaleString()}`);
  console.log(`- Total Expenses: ৳ ${totalExpenses.toLocaleString()}`);
  console.log(`- Net Operating Margin: ৳ ${margin.toLocaleString()}`);
}

verify();
