import * as React from "react";
import {
  User,
  Settings,
  LogIn,
  LogOut,
  Home,
  Camera,
  FileText,
  History,
  Leaf,
} from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  // versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Main Navigation",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        {
          title: "Scanner",
          url: "/dashboard/scanner",
          icon: Camera,
        },
        {
          title: "Results",
          url: "/dashboard/results",
          icon: FileText,
        },
        {
          title: "History",
          url: "/dashboard/history",
          icon: History,
        },
      ],
    },
    {
      title: "Crop Models",
      url: "#",
      items: [
        {
          title: "Tomato",
          url: "/models/tomato",
          icon: Leaf,
        },
        {
          title: "Potato",
          url: "/models/potato",
          icon: Leaf,
        },
      ],
    },
  ],
  userNav: [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Login",
      url: "/login",
      icon: LogIn,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Agri-Lens</h1>
            <p className="text-xs text-green-600 font-medium">v1.0.1</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            Smart Crop Health Monitor
          </p>
          <p className="text-xs text-green-600 mt-1">
            AI-powered disease detection
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation and Crop Models */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((navItem) => (
                  <SidebarMenuItem key={navItem.title}>
                    <SidebarMenuButton asChild isActive={navItem.isActive}>
                      <a href={navItem.url} className="flex items-center gap-2">
                        {navItem.icon && <navItem.icon className="h-4 w-4" />}
                        {navItem.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.userNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
