// import React from "react";
// import Sidebar from "./_components/Sidebar";
// import Header from "./_components/Header";

// // Note: You'll need to manage the mobile sidebar's open/close state.
// // This is typically done with a hook like useState in this component
// // and passed down to the Header (for the toggle button) and Sidebar.

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Sidebar:
//         - Hidden by default on mobile (-translate-x-full).
//         - Becomes visible and fixed on large screens (lg:translate-x-0).
//         - A state change would remove '-translate-x-full' to show it on mobile.
//       */}
//       <aside className="fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 -translate-x-full">
//         <Sidebar />
//       </aside>

//       {/* Main Content Area:
//         - On large screens, a left margin (lg:ml-64) is added to prevent
//           overlapping with the visible sidebar.
//         - On smaller screens, it takes up the full width.
//       */}
//       <div className="lg:ml-64">
//         {/* Header:
//           - Sticky to the top for easy access.
//           - It would contain the hamburger menu button to toggle the sidebar on mobile.
//         */}
//         <header className="sticky top-0 z-30">
//           <Header />
//         </header>

//         {/* Page Content */}
//         <main className="p-4 sm:p-6 lg:p-8">
//           <div className="max-w-7xl mx-auto">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Dynamic breadcrumb mapping
const getBreadcrumbInfo = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 1 && segments[0] === 'dashboard') {
    return { title: 'Overview', isActive: true };
  }
  
  const pageMap: Record<string, string> = {
    'history': 'History',
    'scanner': 'Scanner',
    'results': 'Results',
  };
  
  const currentPage = segments[segments.length - 1];
  return {
    title: pageMap[currentPage] || 'Overview',
    isActive: true
  };
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbInfo = getBreadcrumbInfo(pathname);

  return (
    // Provides sidebar state (open/closed) to all child components.
    <SidebarProvider>
      {/* The actual sidebar component. It's persistent across pages. */}
      <AppSidebar />

      {/* A special container that automatically adjusts its margin 
          to account for the sidebar's width and state. */}
      <SidebarInset>
        {/* The header is sticky for better UX on long pages. */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
          {/* Show AgriLens title only on mobile */}
          <h1 className="text-xl font-bold text-gray-900 lg:hidden">
            Agri-Lens
          </h1>

          <div className="flex items-center gap-2">
            {/* The hamburger button to toggle the sidebar on mobile. */}
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="hidden data-[orientation=vertical]:h-4 md:block"
            />

            {/* Dynamic breadcrumbs based on current route */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbInfo.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* The main content from your page files will be rendered here. */}
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
