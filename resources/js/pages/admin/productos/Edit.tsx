import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X, DollarSign } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Locale {
    id: number;
    name: string;
}

interface Categoria {
    id: number;
    name: string;
}

interface Producto {
    id: number;
    name: string;
    id_locale: number;
    id_categoria: number;
    precio: number;
    cantidad: number | null;
    precio2: number | null;
    marca: string | null;
    model: string | null;
    reposicion: number | null;
    id_ubicacion: number | null;
    locale: Locale;
    categoria: Categoria;
}

interface Props {
    producto: Producto;
    locales: Locale[];
    categorias: Categoria[];
    ubicaciones?: { id: number; name: string }[];
}

export default function Edit({ producto, locales, categorias, ubicaciones }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: producto.name,
        id_locale: producto.id_locale.toString(),
        id_categoria: producto.id_categoria.toString(),
        precio: producto.precio.toString(),
        cantidad: producto.cantidad?.toString() || '',
        precio2: producto.precio2?.toString() || '',
        marca: producto.marca || '',
        model: producto.model || '',
        reposicion: producto.reposicion?.toString() || '',
        id_ubicacion: producto.id_ubicacion?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/productos/${producto.id}`, {
            onSuccess: () => {
                // Success message will be handled by Inertia flash
            },
            onError: () => {
                // Error will be handled by Inertia
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Editar Producto" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Producto</h1>
                        <p className="text-muted-foreground">
                            Modifica la información del producto
                        </p>
                    </div>
                    <Link href="/admin/productos">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Producto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Producto *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ingrese el nombre del producto"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_locale">Locale *</Label>
                                    <Select
                                        value={data.id_locale}
                                        onValueChange={(value) => setData('id_locale', value)}
                                    >
                                        <SelectTrigger className={errors.id_locale ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Seleccione un locale" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locales && locales.length > 0 ? (
                                                locales.map((locale) => (
                                                    <SelectItem key={locale.id} value={locale.id.toString()}>
                                                        {locale.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="py-2 text-center text-muted-foreground">
                                                    No hay locales disponibles
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_locale && (
                                        <p className="text-sm text-red-500">{errors.id_locale}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_categoria">Categoría *</Label>
                                    <Select
                                        value={data.id_categoria}
                                        onValueChange={(value) => setData('id_categoria', value)}
                                    >
                                        <SelectTrigger className={errors.id_categoria ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias && categorias.length > 0 ? (
                                                categorias.map((categoria) => (
                                                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                        {categoria.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="py-2 text-center text-muted-foreground">
                                                    No hay categorías disponibles
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_categoria && (
                                        <p className="text-sm text-red-500">{errors.id_categoria}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="precio">Precio *</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="precio"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.precio}
                                            onChange={(e) => setData('precio', e.target.value)}
                                            placeholder="0.00"
                                            className={`pl-10 ${errors.precio ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.precio && (
                                        <p className="text-sm text-red-500">{errors.precio}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cantidad">Cantidad</Label>
                                    <Input
                                        id="cantidad"
                                        type="number"
                                        min="0"
                                        value={data.cantidad}
                                        onChange={(e) => setData('cantidad', e.target.value)}
                                        placeholder="0"
                                        className={errors.cantidad ? 'border-red-500' : ''}
                                    />
                                    {errors.cantidad && (
                                        <p className="text-sm text-red-500">{errors.cantidad}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="precio2">Precio 2</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="precio2"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.precio2}
                                            onChange={(e) => setData('precio2', e.target.value)}
                                            placeholder="0.00"
                                            className={`pl-10 ${errors.precio2 ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.precio2 && (
                                        <p className="text-sm text-red-500">{errors.precio2}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marca">Marca</Label>
                                    <Input
                                        id="marca"
                                        type="text"
                                        value={data.marca}
                                        onChange={(e) => setData('marca', e.target.value)}
                                        placeholder="Ingrese la marca"
                                        className={errors.marca ? 'border-red-500' : ''}
                                    />
                                    {errors.marca && (
                                        <p className="text-sm text-red-500">{errors.marca}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model">Modelo</Label>
                                    <Input
                                        id="model"
                                        type="text"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="Ingrese el modelo"
                                        className={errors.model ? 'border-red-500' : ''}
                                    />
                                    {errors.model && (
                                        <p className="text-sm text-red-500">{errors.model}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reposicion">Reposición</Label>
                                    <Input
                                        id="reposicion"
                                        type="number"
                                        min="0"
                                        value={data.reposicion}
                                        onChange={(e) => setData('reposicion', e.target.value)}
                                        placeholder="0"
                                        className={errors.reposicion ? 'border-red-500' : ''}
                                    />
                                    {errors.reposicion && (
                                        <p className="text-sm text-red-500">{errors.reposicion}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_ubicacion">Ubicación</Label>
                                    <Select
                                        value={data.id_ubicacion}
                                        onValueChange={(value) => setData('id_ubicacion', value)}
                                    >
                                        <SelectTrigger className={errors.id_ubicacion ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Seleccione una ubicación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">Sin ubicación</SelectItem>
                                            {ubicaciones && ubicaciones.length > 0 ? (
                                                ubicaciones.map((ubicacion) => (
                                                    <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                                                        {ubicacion.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="py-2 text-center text-muted-foreground">
                                                    No hay ubicaciones disponibles
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_ubicacion && (
                                        <p className="text-sm text-red-500">{errors.id_ubicacion}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Actualizar
                                </Button>
                                <Link href="/admin/productos">
                                    <Button type="button" variant="outline">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
