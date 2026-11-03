import { getAllInvoices, getAllLeads } from '@/lib/data';
import { InvoicesClient } from '@/components/InvoicesClient';

export const revalidate = 0; // Dynamic server component

export default async function InvoicesPage() {
  const [invoices, contacts] = await Promise.all([
    getAllInvoices(),
    getAllLeads(),
  ]);

  return <InvoicesClient invoices={invoices} contacts={contacts} />;
}
