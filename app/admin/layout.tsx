// app/admin/layout.tsx
import AdminSidebar from '@/components/admin/AdminHeader';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 bg-gray-800">
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </main>
      </div>
    </div>
  );
}