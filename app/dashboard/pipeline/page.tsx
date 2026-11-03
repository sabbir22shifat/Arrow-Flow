import { getAllLeads } from '@/lib/data';
import { PipelineBoard } from '@/components/PipelineBoard';

export const revalidate = 0;

export default async function PipelinePage() {
  const leads = await getAllLeads();
  return <PipelineBoard leads={leads} />;
}
