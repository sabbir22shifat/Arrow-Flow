import { getPayrollRecords, getEmployees } from '@/lib/data';
import { PayrollClient } from '@/components/PayrollClient';

export const revalidate = 0;

export default async function PayrollPage() {
  const [payroll, employees] = await Promise.all([
    getPayrollRecords(),
    getEmployees(),
  ]);

  return <PayrollClient payroll={payroll} employees={employees} />;
}
