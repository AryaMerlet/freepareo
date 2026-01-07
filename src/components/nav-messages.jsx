import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { ChatRoom } from './chat-room'

export const NavMessages = ({ items = [] }) => {
    return (
        <SidebarMenu className="px-2">
            {items.map((item) => (
                <Drawer key={item.title} direction="bottom">
                    <SidebarMenuItem>
                        <DrawerTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </DrawerTrigger>
                    </SidebarMenuItem>
                    <DrawerContent className="h-[80vh]" >
                        <DrawerHeader className="shrink-0">
                            <DrawerTitle>{item.title}</DrawerTitle>
                        </DrawerHeader>
                        <div className="flex-1 min-h-0 relative">
                            <ChatRoom />
                        </div>
                    </DrawerContent>
                </Drawer>
            ))}
        </SidebarMenu>
    )
}


