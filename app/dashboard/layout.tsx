import { getAllLeads } from '@/lib/data';
import { BrandLogo } from '@/components/BrandLogo';
import { SidebarNav } from '@/components/SidebarNav';
import { UserProfileBadge } from '@/components/UserProfileBadge';
import { TopNavbar } from '@/components/TopNavbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contacts = await getAllLeads();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 h-screen sticky top-0">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800/80">
          <BrandLogo />
        </div>

        {/* Sidebar Navigation */}
        <SidebarNav />

        {/* User Profile Badge at bottom */}
        <UserProfileBadge />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar contacts={contacts} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
