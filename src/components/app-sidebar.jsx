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
import { NavMessages } from "./nav-messages";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Evalutatioon",
			url: "/evaluation",
			icon: IconDashboard,
		},
		{
			title: "Ressource documentation",
			url: "/ressource-documentation",
			icon: IconListDetails,
		}
	],
	navMessage: [
		{
			title: "Message",
			icon: IconMessage,
		}
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	],
	Admin: [
		{
			name: "Utilisateurs",
			url: "/users",
			icon: IconDatabase,
		},
		{
			name: "Cours",
			url: "/cours",
			icon: IconReport,
		},
		{
			name: "dashboard Admin",
			url: "/admin-dashboard",
			icon: IconFileAi,
		},
	],
};

export function AppSidebar({ ...props }) {
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
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}

export default AppSidebar;
