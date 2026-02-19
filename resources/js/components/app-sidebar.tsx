import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings, Users, MapPin, User, Briefcase, Tag, UserCheck, Wrench, CreditCard, TrendingUp, UserPlus, MapPinHouse } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import tienda_cargo from '@/routes/tienda_cargo';
import roles from '@/routes/roles';
import users from '@/routes/users';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Admin',
        icon: Settings,
        items: [
            {
                title: 'Catalogo',
                href: tienda_cargo.index.url(),
                icon: LayoutGrid,
            },
            {
                title: 'Locales',
                href: '/admin/locales',
                icon: MapPin,
            },
            {
                title: 'Empleados',
                href: '/admin/empleados',
                icon: User,
            },
            {
                title: 'Cargos',
                href: '/admin/cargos',
                icon: Briefcase,
            },
            {
                title: 'Cargo-Empleados',
                href: '/admin/cargo-empleados',
                icon: Users,
            },
            {
                title: 'Empleado-Usuario',
                href: '/admin/empleado-users',
                icon: UserPlus,
            },
            {
                title: 'Usuario-Locale',
                href: '/admin/locale-users',
                icon: MapPinHouse,
            },
            {
                title: 'Categorías',
                href: '/admin/categorias',
                icon: Tag,
            },
            {
                title: 'Promotores',
                href: '/admin/promotores',
                icon: UserCheck,
            },
            {
                title: 'Técnicos',
                href: '/admin/tecnicos',
                icon: Wrench,
            },
            {
                title: 'Formas de Pago',
                href: '/admin/formapagos',
                icon: CreditCard,
            },
            {
                title: 'Tasas BCV',
                href: '/admin/tasabcvs',
                icon: TrendingUp,
            },
            {
                title: 'Roles',
                href: roles.index.url(),
                icon: LayoutGrid,
            },
            {
                title: 'Usuarios',
                href: users.index.url(),
                icon: Users,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
