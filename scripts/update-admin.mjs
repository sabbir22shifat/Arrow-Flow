import { neon } from '@neondatabase/serverless';

const dbUrl = "postgresql://neondb_owner:npg_mJspd9jiOQL1@ep-wandering-dust-aot761v5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql = neon(dbUrl);
  
  await sql`
    INSERT INTO profiles (email, full_name, role)
    VALUES ('admin@arrowsolutions.com', 'Md. Sabbir Ahammed Shifat', 'admin')
    ON CONFLICT (email) DO UPDATE SET full_name = 'Md. Sabbir Ahammed Shifat';
  `;

  await sql`
    INSERT INTO profiles (email, full_name, role)
    VALUES ('shifat@arrowsolutions.com', 'Md. Sabbir Ahammed Shifat', 'admin')
    ON CONFLICT (email) DO UPDATE SET full_name = 'Md. Sabbir Ahammed Shifat';
  `;

  await sql`
    INSERT INTO employees (full_name, designation, base_salary, joining_date, phone, email)
    VALUES ('Md. Sabbir Ahammed Shifat', 'Chief Executive Officer (CEO)', 120000.00, '2024-01-01', '+8801700112233', 'shifat@arrowsolutions.com')
    ON CONFLICT DO NOTHING;
  `;

  const profiles = await sql`SELECT email, full_name, role FROM profiles;`;
  console.log('✅ UPDATED NEON PROFILES:');
  console.table(profiles);
}

main();
