import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, MapPin, Phone, Mail, Building, IdCard } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locales',
        href: "#",
    },
];

interface Locale {
    id: number;
    name: string;
    rif: string;
    direccion: string;
    ciudad: string;
    telefono?: string;
    celular?: string;
    email?: string;
    logo?: string;
    estado: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Locale[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const locales = page.locales as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/locales', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este local?')) {
            router.delete(`/admin/locales/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Locales</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona los locales comerciales disponibles en el sistema
                        </p>
                    </div>
                    <Link href="/admin/locales/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Local
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Listado de Locales</span>
                            <Badge variant="secondary">
                                {locales.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar locales..."
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
                                        <th className="text-left p-3 font-medium">Logo</th>
                                        <th className="text-left p-3 font-medium">Nombre</th>
                                        <th className="text-left p-3 font-medium">RIF</th>
                                        <th className="text-left p-3 font-medium">Ciudad</th>
                                        <th className="text-left p-3 font-medium">Dirección</th>
                                        <th className="text-left p-3 font-medium">Contacto</th>
                                        <th className="text-left p-3 font-medium">Estado</th>
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locales.data.length > 0 ? (
                                        locales.data.map((locale) => (
                                            <tr key={locale.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{locale.id}</td>
                                                <td className="p-3">
                                                    {locale.logo ? (
                                                        <img 
                                                            src={locale.logo} 
                                                            alt={locale.name}
                                                            className="h-12 w-12 object-cover rounded border"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-muted rounded border flex items-center justify-center">
                                                            <span className="text-xs text-muted-foreground">Sin logo</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 font-medium">{locale.name}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <IdCard className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-mono text-sm">{locale.rif}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building className="w-4 h-4 text-muted-foreground" />
                                                        <span>{locale.ciudad}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        <span className="max-w-xs truncate">{locale.direccion}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="space-y-1">
                                                        {locale.telefono && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                                <span>{locale.telefono}</span>
                                                            </div>
                                                        )}
                                                        {locale.celular && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                                <span>{locale.celular}</span>
                                                            </div>
                                                        )}
                                                        {locale.email && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail className="w-3 h-3 text-muted-foreground" />
                                                                <span className="max-w-xs truncate">{locale.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant={locale.estado ? "default" : "secondary"}>
                                                        {locale.estado ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/locales/${locale.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(locale.id)}
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
                                            <td colSpan={9} className="text-center p-8 text-muted-foreground">
                                                No se encontraron locales
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {locales.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {locales.from} a {locales.to} de {locales.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {locales.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/locales', { page: locales.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {locales.current_page} de {locales.last_page}
                                    </span>
                                    {locales.current_page < locales.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/locales', { page: locales.current_page + 1, search })}
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
