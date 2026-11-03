import { getAllExpenses } from '@/lib/data';
import { ExpensesClient } from '@/components/ExpensesClient';

export const revalidate = 0;

export default async function ExpensesPage() {
  const expenses = await getAllExpenses();
  return <ExpensesClient expenses={expenses} />;
}
