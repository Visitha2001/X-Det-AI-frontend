// app/admin/layout.tsx
import AdminSidebar from '@/components/admin/AdminHeader';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';


export const metadata: Metadata = {
  title : "Admin - X-Det-AI",
  description: "X-Det-AI is a AI based app for detecting X-ray diseases",
  twitter: {
    card: "summary_large_image",
    images: ["/assets/Dark_Logo.png"],
  },
};

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