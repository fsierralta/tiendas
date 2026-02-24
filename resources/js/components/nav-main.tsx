import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { getUserRoles } from '@/hooks/helper/getUserRoles';


export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const props = usePage().props;
    const [userRoles] = getUserRoles(props);
   


    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    userRoles.includes(item.title) ? (
                        <SidebarMenuItem key={item.title}>
                            {item.items ? (
                                // Menu item with sub-items
                                <>
                                    <SidebarMenuButton tooltip={{ children: item.title }}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={subItem.href ? isCurrentUrl(subItem.href) : false}
                                                >
                                                    <Link href={subItem.href || '#'} prefetch>
                                                        {subItem.icon && <subItem.icon />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </>
                            ) : (
                                // Simple menu item
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href ? isCurrentUrl(item.href) : false}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href || '#'} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ) : null
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
