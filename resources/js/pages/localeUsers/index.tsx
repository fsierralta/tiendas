import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Users, User, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignación Usuario-Locale',
        href: "#",
    },
];

interface LocaleUser {
    id: number;
    id_user: number;
    id_locale: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    locale: {
        id: number;
        name: string;
        direccion: string;
        ciudad: string;
        email: string;
        celular: string;
        telefono: string;
    };
}

interface PaginatedData {
    data: LocaleUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const localeUsers = page.localeUsers as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/locale-users', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta asignación?')) {
            router.delete(`/admin/locale-users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Asignación Usuario-Locale</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona la asignación de usuarios a locales del sistema
                        </p>
                    </div>
                    <Link href="/admin/locale-users/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Asignación
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Asignaciones Activas</span>
                            <Badge variant="secondary">
                                {localeUsers.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar asignaciones..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium">ID</th>
                                        <th className="text-left p-3 font-medium">Usuario</th>
                                        <th className="text-left p-3 font-medium">Locale</th>
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {localeUsers.data.length > 0 ? (
                                        localeUsers.data.map((asignacion) => (
                                            <tr key={asignacion.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{asignacion.id}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        <div>
                                                            <span className="font-medium">{asignacion.user.name}</span>
                                                            <p className="text-sm text-muted-foreground">{asignacion.user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        <div>
                                                            <span className="font-medium">{asignacion.locale.name}</span>
                                                            <p className="text-sm text-muted-foreground">{asignacion.locale.direccion}</p>
                                                            <p className="text-xs text-muted-foreground">{asignacion.locale.ciudad}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/locale-users/${asignacion.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(asignacion.id)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center p-8 text-muted-foreground">
                                                No se encontraron asignaciones
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {localeUsers.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {localeUsers.from} a {localeUsers.to} de {localeUsers.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {localeUsers.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/locale-users', { page: localeUsers.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {localeUsers.current_page} de {localeUsers.last_page}
                                    </span>
                                    {localeUsers.current_page < localeUsers.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/locale-users', { page: localeUsers.current_page + 1, search })}
                                        >
                                            Siguiente
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
