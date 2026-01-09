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
  IconSearch,
  IconSettings,
  IconUsers,
  IconMessage,
  IconBook,
} from "@tabler/icons-react";

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
import { isAdmin } from "@/utils/role";
import { NavMessages } from "./nav-messages";
import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
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

  // Build admin items; include dashboard link for admin users
  const adminItems = [...data.Admin];
  if (isAdmin(user)) {
    // Show dashboard to admins
    adminItems.unshift({
      name: "Tableau de bord",
      url: "/admin/dashboard",
      icon: IconDashboard,
    });
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
        <NavDocuments items={adminItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.profile} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
