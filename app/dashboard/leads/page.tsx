import { getAllLeads } from '@/lib/data';
import { LeadsClient } from '@/components/LeadsClient';

export const revalidate = 0;

export default async function LeadsPage() {
  const leads = await getAllLeads();
  return <LeadsClient initialLeads={leads} />;
}
