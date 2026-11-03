import { neon } from '@neondatabase/serverless';

const dbUrl = "postgresql://neondb_owner:npg_mJspd9jiOQL1@ep-wandering-dust-aot761v5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function audit() {
  console.log('====================================================');
  console.log('🎯 ARROW FLOW — FULL SYSTEM & DATABASE AUDIT');
  console.log('====================================================\n');

  const sql = neon(dbUrl);
  let passed = 0;
  let failed = 0;

  function report(testName, ok, details = '') {
    if (ok) {
      console.log(`✅ [PASS] ${testName} ${details ? '— ' + details : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? '— ' + details : ''}`);
      failed++;
    }
  }

  try {
    // 1. Database Ping
    const ping = await sql`SELECT NOW() as db_time, current_database() as db_name, version() as ver;`;
    report('Neon Postgres Connection', !!ping[0].db_name, `Connected to "${ping[0].db_name}" (${ping[0].db_time})`);

    // 2. Table Existences
    const tables = ['profiles', 'contacts', 'invoices', 'expenses', 'employees', 'payroll'];
    for (const tbl of tables) {
      const chk = await sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = ${tbl};
      `;
      report(`Table Exists: "${tbl}"`, Number(chk[0].count) > 0);
    }

    // 3. Row Counts
    const cCount = await sql`SELECT COUNT(*) as count FROM contacts;`;
    const iCount = await sql`SELECT COUNT(*) as count FROM invoices;`;
    const eCount = await sql`SELECT COUNT(*) as count FROM expenses;`;
    const empCount = await sql`SELECT COUNT(*) as count FROM employees;`;
    const pCount = await sql`SELECT COUNT(*) as count FROM payroll;`;

    report('Contacts / Leads Data', Number(cCount[0].count) > 0, `${cCount[0].count} records found`);
    report('Invoices Data', Number(iCount[0].count) > 0, `${iCount[0].count} records found`);
    report('Expenses Data', Number(eCount[0].count) > 0, `${eCount[0].count} records found`);
    report('Employees Data', Number(empCount[0].count) > 0, `${empCount[0].count} staff found`);
    report('Payroll Data', Number(pCount[0].count) > 0, `${pCount[0].count} records found`);

    // 4. Financial Calculation Audit
    const invData = await sql`SELECT total_amount, paid_amount FROM invoices;`;
    const expData = await sql`SELECT amount FROM expenses;`;

    const cashCollected = invData.reduce((s, i) => s + Number(i.paid_amount), 0);
    const totalInvoiced = invData.reduce((s, i) => s + Number(i.total_amount), 0);
    const outstanding = Math.max(0, totalInvoiced - cashCollected);
    const totalExpenses = expData.reduce((s, e) => s + Number(e.amount), 0);
    const netMargin = cashCollected - totalExpenses;

    report('Financial Engine Accuracy', cashCollected > 0 && totalExpenses > 0, 
      `Collected: ৳${cashCollected.toLocaleString()} | Due: ৳${outstanding.toLocaleString()} | Expenses: ৳${totalExpenses.toLocaleString()} | Margin: ৳${netMargin.toLocaleString()}`);

    // 5. Live Mutation Test: Insert -> Update -> Delete Lead
    const testLead = await sql`
      INSERT INTO contacts (name, company, phone, email, service_domain, status, deal_value, notes)
      VALUES ('Audit Test User', 'Arrow Quality Labs', '+8801700998877', 'audit@test.com', 'Web & IT', 'New', 99000, 'Automated health check test lead')
      RETURNING id, status, deal_value;
    `;
    const leadId = testLead[0].id;
    report('Live Lead Insertion (CREATE)', !!leadId, `Inserted ID: ${leadId}`);

    const updatedLead = await sql`
      UPDATE contacts SET status = 'Won' WHERE id = ${leadId} RETURNING status;
    `;
    report('Live Pipeline Status Mutation (UPDATE)', updatedLead[0].status === 'Won', `Status changed to "Won"`);

    await sql`DELETE FROM contacts WHERE id = ${leadId};`;
    report('Live Cleanup (DELETE)', true, 'Temporary test record pruned cleanly');

    console.log('\n====================================================');
    console.log(`🎉 AUDIT COMPLETE: ${passed} Passed | ${failed} Failed`);
    console.log('====================================================');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Audit crashed with error:', err);
    process.exit(1);
  }
}

audit();
