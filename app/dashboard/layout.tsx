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
import Link from "next/link";
import ElevenLabsConvai from "./ElevenLabsConvai";

// Dynamic breadcrumb mapping
const getBreadcrumbInfo = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);

  // Handle root dashboard
  if (segments.length === 1 && segments[0] === "dashboard") {
    return {
      segments: [{ title: "Dashboard", href: "/dashboard" }],
      currentTitle: "Overview",
    };
  }

  // Page mapping with better coverage
  const pageMap: Record<string, string> = {
    history: "History",
    scanner: "Scanner",
    results: "Results",
    chat: "Chat Assistant",
    market: "Market Info",
    weather: "Weather",
    schemes: "Government Schemes",
    models: "Crop Models",
    tomato: "Tomato",
    potato: "Potato",
  };

  const currentPage = segments[segments.length - 1];
  const currentTitle =
    pageMap[currentPage] ||
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  // Build breadcrumb segments
  const breadcrumbSegments = [{ title: "Dashboard", href: "/dashboard" }];

  // Add intermediate segments if needed
  if (segments.length > 2) {
    for (let i = 1; i < segments.length - 1; i++) {
      const segment = segments[i];
      const segmentTitle =
        pageMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const segmentPath = `/${segments.slice(0, i + 1).join("/")}`;
      breadcrumbSegments.push({
        title: segmentTitle,
        href: segmentPath,
      });
    }
  }

  return {
    segments: breadcrumbSegments,
    currentTitle,
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
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b bg-background px-4">
          {/* Mobile layout: Hamburger + Logo on left side */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* The hamburger button to toggle the sidebar on mobile. */}
            <SidebarTrigger className="-ml-1" />
            {/* Show AgriLens title only on mobile */}
            <Link href={"/"}>
              <h1 className="text-xl font-bold text-gray-900">AgriLenses</h1>
            </Link>
          </div>

          {/* Desktop layout: Sidebar trigger + Breadcrumbs */}
          <div className="hidden lg:flex items-center gap-2 flex-1">
            {/* The hamburger button to toggle the sidebar on desktop. */}
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />

            {/* Dynamic breadcrumbs based on current route */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbInfo.segments.map((segment, index) => (
                  <React.Fragment key={segment.href}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={segment.href}>
                        {segment.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbInfo.segments.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </React.Fragment>
                ))}
                {breadcrumbInfo.currentTitle !== "Overview" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {breadcrumbInfo.currentTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Mobile breadcrumb - show current page only */}
          <div className="lg:hidden flex-1 text-center">
            <span className="text-sm font-medium text-gray-700">
              {breadcrumbInfo.currentTitle}
            </span>
          </div>
        </header>

        {/* The main content from your page files will be rendered here. */}
        <div className="h-screen max-h-screen overflow-hidden flex flex-col relative">
          <main className="flex-1 h-full overflow-auto w-full">
            {children}
            <div className="absolute bottom-[10%] right-8 w-[250px]">
              {/* <ElevenLabsConvai /> */}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
