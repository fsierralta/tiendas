import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings, Users, MapPin, User, Briefcase, Tag, UserCheck, Wrench, CreditCard, TrendingUp, UserPlus, MapPinHouse, Package, Percent, DollarSign } from 'lucide-react';
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
//import tienda_cargo from '@/routes/tienda_cargo';
import roles from '@/routes/roles';
import users from '@/routes/users';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'admin',
        icon: Settings,
        items: [
           
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
                title: 'Empleado-Locale',
                href: '/admin/locale-empleados',
                icon: Users,
            },
            {
                title: 'Productos',
                href: '/admin/productos',
                icon: Package,
            },
            {
                title: 'Clientes',
                href: '/admin/clientes',
                icon: Users,
            },
            {
                title: 'Ubicaciones',
                href: '/admin/ubicaciones',
                icon: MapPin,
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
                title: 'Comisiones',
                href: '/admin/comisiones',
                icon: Percent,
            },
            {
                title: 'Ventas',
                href: '/ventas',
                icon: DollarSign,
            },
            {
                title: 'Roles',
                href: '/admin/roles',
                icon: LayoutGrid,
            },
            {
                title: 'Usuarios',
                href: '/admin/users',
                icon: Users,
            },
        ],
    },
    {
        title: 'vendedor',
        icon: Users,
        items:[
            {
                title: 'Ventas',
                href: '/ventas',
                icon: DollarSign,
            }
        ]
    },
    {
        title: 'jefe',
        icon: Users,
        items:[
          
            {
                title: 'Pagos',
                href: '/pagos',
                icon: CreditCard,
            }
        ]
    }


];

const footerNavItems: NavItem[] = [];

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
