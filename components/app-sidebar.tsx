import * as React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

type MainNavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
};

type CropModelNavItem = {
  title: string;
  url: string;
  iconuri: string;
};

type NavGroup =
  | {
      title: "Main Navigation";
      url: string;
      items: MainNavItem[];
    }
  | {
      title: "Crop Models";
      url: string;
      items: CropModelNavItem[];
    };

type UserNavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};
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
  MessageCircle,
  BookOpen,
  Building2,
  TrendingUp,
  CloudSun,
} from "lucide-react";

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
import Link from "next/link";

// This is sample data.
const data: {
  navMain: NavGroup[];
  userNav: UserNavItem[];
} = {
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
          title: "AI Chat",
          url: "/dashboard/chat",
          icon: MessageCircle,
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
        {
          title: "Chat History",
          url: "/dashboard/chat/history",
          icon: BookOpen,
        },
        {
          title: "Gov Schemes",
          url: "/dashboard/schemes",
          icon: Building2,
        },
        {
          title: "Market Prices",
          url: "/dashboard/market",
          icon: TrendingUp,
        },
        {
          title: "Weather",
          url: "/dashboard/weather",
          icon: CloudSun,
        },
      ],
    },
    {
      title: "Crop Models",
      url: "#",
      items: [
        {
          title: "Tomato",
          url: "/dashboard/models/tomato",
          iconuri: "/vegicons/tomate.png",
        },
        {
          title: "Potato",
          url: "/dashboard/models/potato",
          iconuri: "/vegicons/potato.png",
        },
      ],
    },
  ],
  userNav: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
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
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper function to check if a nav item is active
  const isActiveNavItem = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-6 border-b border-gray-200 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <Link href={"/"}>
              <h1 className="text-xl font-bold text-gray-900">AgriLenses</h1>
            </Link>
            <p className="text-xs text-green-600 font-medium">v1.0.1</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            Smart Crop Advisor
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
                {item.title === "Crop Models"
                  ? item.items.map((navItem) => (
                      <SidebarMenuItem key={navItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActiveNavItem(navItem.url)}
                        >
                          <a
                            href={navItem.url}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={navItem.iconuri}
                              alt={navItem.title}
                              className="h-4 w-4"
                            />

                            {navItem.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  : item.items.map((navItem) => (
                      <SidebarMenuItem key={navItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActiveNavItem(navItem.url)}
                        >
                          <a
                            href={navItem.url}
                            className="flex items-center gap-2"
                          >
                            {navItem.icon && (
                              <navItem.icon className="h-4 w-4" />
                            )}
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
                    {item.title === "Logout" ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </button>
                    ) : item.title === "Login" && isSignedIn ? null : (
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </a>
                    )}
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
