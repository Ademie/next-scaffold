import { requireAdminSession } from '@/lib/auth/dal';
import { DashboardSidebar } from '@/features/dashboard/components/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen flex bg-base-100">
      <DashboardSidebar
        userName={session.name}
        userRole={session.role}
        orgName={session.organizationName}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
