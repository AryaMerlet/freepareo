import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconUsers,
  IconMessage,
  IconBook,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { NavMessages } from "./nav-messages";
import { Navigate } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Mes cours",
      url: "/cours",
      icon: IconBook,
    },
    {
      title: "Evalutatioon",
      url: "/evaluation",
      icon: IconDashboard,
    },
  ],
  navMessage: [
    {
      title: "Message",
      icon: IconMessage,
    },
  ],
  navSecondary: [],
  Admin: [
    {
      name: "Gestion des cours",
      url: "/admin/cours",
      icon: IconReport,
    },
    {
      name: "Gestion des utilisateurs",
      url: "/admin/users",
      icon: IconUsers,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="data-[slot=sidebar-menu-button]:p-1.5 flex items-center gap-2">
              <IconInnerShadowTop className="size-5!" />
              <span className="text-base font-semibold">LOGOOOOO</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMessages items={data.navMessage} />
        <NavDocuments items={data.Admin} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.profile} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
