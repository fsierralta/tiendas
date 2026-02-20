import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowLeft, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

interface Producto {
    id: number;
    name: string;
    precio: number;
    cantidad: number | null;
    precio2: number | null;
    marca: string | null;
    model: string | null;
    reposicion: number | null;
    locale: {
        id: number;
        name: string;
    };
    categoria: {
        id: number;
        name: string;
    };
    ubicacion: {
        id: number;
        name: string;
    } | null;
}

interface PaginatedProductos {
    data: Producto[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}

interface Props {
    productos: PaginatedProductos;
    flash?: {
        success?: string;
    };
}

export default function Index({ productos, flash }: Props) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'name' | 'id_locale'>('name');

    useEffect(() => {
        if (flash?.success) {
            // Flash message will be handled by Inertia
        }
    }, [flash]);

    useEffect(() => {
        // Update URL with search parameters
        const params = new URLSearchParams(window.location.search);
        
        if (searchTerm) {
            params.set('search', searchTerm);
            params.set('field', searchField);
        } else {
            params.delete('search');
            params.delete('field');
        }
        
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        
        if (newUrl !== window.location.pathname + window.location.search) {
            router.get(newUrl, {}, { preserveState: true, preserveScroll: true });
        }
    }, [searchTerm, searchField]);

    useEffect(() => {
        // Initialize search from URL parameters
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search') || '';
        const field = params.get('field') || 'name';
        
        setSearchTerm(search);
        setSearchField(field as 'name' | 'id_locale');
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este producto?')) {
            setIsDeleting(id);
            router.delete(`/admin/productos/${id}`, {
                onSuccess: () => {
                    setIsDeleting(null);
                },
                onError: () => {
                    setIsDeleting(null);
                }
            });
        }
    };

    const formatCurrency = (amount: number | null | string) => {
        if (!amount) return 'N/A';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `$${numAmount.toFixed(2)}`;
    };

    return (
        <AppLayout>
            <Head title="Productos" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Productos</h1>
                        <p className="text-muted-foreground">
                            Gestiona el inventario de productos
                        </p>
                    </div>
                    <Link href="/admin/productos/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Productos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                            <Select value={searchField} onValueChange={(value: 'name' | 'id_locale') => setSearchField(value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Nombre</SelectItem>
                                    <SelectItem value="id_locale">Locale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Productos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {productos.data.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Locale</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Marca</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productos.data.map((producto: Producto) => (
                                        <TableRow key={producto.id}>
                                            <TableCell>
                                                <Badge variant="secondary">{producto.id}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{producto.name}</div>
                                                    {producto.model && (
                                                        <div className="text-sm text-muted-foreground">{producto.model}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {producto.locale?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {producto.categoria?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(producto.precio)}
                                            </TableCell>
                                            <TableCell>
                                                {producto.cantidad ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {producto.marca || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/admin/productos/${producto.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(producto.id)}
                                                        disabled={isDeleting === producto.id}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground mt-2">No se encontraron productos</p>
                                <p className="text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
                                <Link href="/admin/productos/create" className="mt-4">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Primer Producto
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {productos.data.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {productos.data.length} de {productos.total} productos
                        </div>
                        <div className="flex space-x-2">
                            {productos.links.prev && (
                                <Link href={productos.links.prev}>
                                    <Button variant="outline" size="sm">
                                        Anterior
                                    </Button>
                                </Link>
                            )}
                            <span className="text-sm text-muted-foreground">
                                Página {productos.current_page} de {productos.last_page}
                            </span>
                            {productos.links.next && (
                                <Link href={productos.links.next}>
                                    <Button variant="outline" size="sm">
                                        Siguiente
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
