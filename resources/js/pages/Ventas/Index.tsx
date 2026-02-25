import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Calendar, DollarSign } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface VentaCabezera {
    id: number;
    fecha: string;
    monto_total: number;
    cliente: {
        id: number;
        name: string;
        cedula_rif: string;
    };
    promotor?: {
        name: string;
    };
    tecnico?: {
        name: string;
    };
    ventaFooter?: {
        total: number;
        iva: number;
        descuento: number;
    }[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedVentas {
    data: VentaCabezera[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

const breadcrumbs = [
    {
        title: 'Ventas',
        href: "/ventas",
    },
];

export default function Index({ ventas }: { ventas: PaginatedVentas }) {
    const { url } = usePage();
    const [search, setSearch] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);

        router.get(`${url}?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <>
            <Head title="Ventas" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Ventas</h1>
                            <p className="text-muted-foreground mt-2">
                                Gestiona las ventas del sistema
                            </p>
                        </div>
                        <Link href="/ventas/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Venta
                            </Button>
                        </Link>
                    </div>

                    {/* Filtros */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Filtros de Búsqueda
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Input
                                        placeholder="Buscar por cliente o cédula..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        placeholder="Fecha inicio"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        placeholder="Fecha fin"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Button onClick={handleSearch} className="w-full">
                                        <Search className="w-4 h-4 mr-2" />
                                        Buscar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de Ventas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Lista de Ventas
                                </span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {ventas.total} ventas encontradas
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ventas.data.length > 0 ? (
                                <div className="space-y-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Participantes</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ventas.data.map((venta) => (
                                                <TableRow key={venta.id}>
                                                    <TableCell className="font-medium">
                                                        #{venta.id.toString().padStart(6, '0')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            {formatDate(venta.fecha)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{venta.cliente.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {venta.cliente.cedula_rif}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-semibold text-green-600">
                                                            {venta.ventaFooter && venta.ventaFooter.length > 0 
                                                                ? formatCurrency(venta.ventaFooter[0].total) 
                                                                : formatCurrency(venta.monto_total)}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            IVA: {venta.ventaFooter && venta.ventaFooter.length > 0 
                                                                ? formatCurrency(venta.ventaFooter[0].iva) 
                                                                : `IVA incluido`}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            {venta.promotor && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Promotor: {venta.promotor.name}
                                                                </Badge>
                                                            )}
                                                            {venta.tecnico && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    Técnico: {venta.tecnico.name}
                                                                </Badge>
                                                            )}
                                                            {!venta.promotor && !venta.tecnico && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Sin participantes
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                                            Completada
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Link href={`/ventas/${venta.id}`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Paginación */}
                                    {ventas.last_page > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!ventas.links[0]?.url}
                                                onClick={() => ventas.links[0]?.url && router.get(ventas.links[0].url)}
                                            >
                                                Anterior
                                            </Button>
                                            
                                            <div className="flex gap-1">
                                                {ventas.links.slice(1, -1).map((link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                        disabled={!link.url}
                                                        onClick={() => link.url && router.get(link.url)}
                                                    >
                                                        {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                                    </Button>
                                                ))}
                                            </div>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!ventas.links[ventas.links.length - 1]?.url}
                                                onClick={() => {
                                                    const lastUrl = ventas.links[ventas.links.length - 1]?.url;
                                                    if (lastUrl) router.get(lastUrl);
                                                }}
                                            >
                                                Siguiente
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                        No se encontraron ventas
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        No hay ventas que coincidan con los criterios de búsqueda
                                    </p>
                                    <Link href="/ventas/create">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Crear Primera Venta
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
