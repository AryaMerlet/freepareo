import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import SiteHeader from "@/components/site-header";
import SectionCards from "@/components/section-cards";
import ChartAreaInteractive from "@/components/chart-area-interactive";
import DataTable from "@/components/data-table";

export const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
