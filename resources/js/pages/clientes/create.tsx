import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    {
        title: 'Clientes',
        href: "/admin/clientes",
    },
    {
        title: 'Nuevo Cliente',
        href: "#",
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        apellido: '',
        email: '',
        ciudad: '',
        direccion: '',
        telefono: '',
        cedula_rif: '',
        tipo: 'N',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/clientes', {
            onSuccess: () => {
                // Success message will be handled by Inertia flash
            },
            onError: () => {
                // Error will be handled by Inertia
            }
        });
    };

    return (
        <>
            <Head title="Nuevo Cliente" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
                            <p className="text-muted-foreground mt-2">
                                Crea un nuevo cliente para el sistema
                            </p>
                        </div>
                        <Link href="/admin/clientes">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ingrese el nombre del cliente"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="apellido">Apellido *</Label>
                                        <Input
                                            id="apellido"
                                            type="text"
                                            value={data.apellido}
                                            onChange={(e) => setData('apellido', e.target.value)}
                                            placeholder="Ingrese el apellido del cliente"
                                            className={errors.apellido ? 'border-red-500' : ''}
                                        />
                                        {errors.apellido && (
                                            <p className="text-sm text-red-500">{errors.apellido}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Ingrese el email del cliente"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cedula_rif">Cédula/RIF *</Label>
                                        <Input
                                            id="cedula_rif"
                                            type="text"
                                            value={data.cedula_rif}
                                            onChange={(e) => setData('cedula_rif', e.target.value)}
                                            placeholder="Ingrese la cédula o RIF"
                                            className={errors.cedula_rif ? 'border-red-500' : ''}
                                        />
                                        {errors.cedula_rif && (
                                            <p className="text-sm text-red-500">{errors.cedula_rif}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input
                                            id="telefono"
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            placeholder="Ingrese el teléfono del cliente"
                                            className={errors.telefono ? 'border-red-500' : ''}
                                        />
                                        {errors.telefono && (
                                            <p className="text-sm text-red-500">{errors.telefono}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ciudad">Ciudad</Label>
                                        <Input
                                            id="ciudad"
                                            type="text"
                                            value={data.ciudad}
                                            onChange={(e) => setData('ciudad', e.target.value)}
                                            placeholder="Ingrese la ciudad del cliente"
                                            className={errors.ciudad ? 'border-red-500' : ''}
                                        />
                                        {errors.ciudad && (
                                            <p className="text-sm text-red-500">{errors.ciudad}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="direccion">Dirección</Label>
                                        <Input
                                            id="direccion"
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            placeholder="Ingrese la dirección del cliente"
                                            className={errors.direccion ? 'border-red-500' : ''}
                                        />
                                        {errors.direccion && (
                                            <p className="text-sm text-red-500">{errors.direccion}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tipo">Tipo *</Label>
                                        <Select
                                            value={data.tipo}
                                            onValueChange={(value) => setData('tipo', value)}
                                        >
                                            <SelectTrigger className={errors.tipo ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Seleccione el tipo de cliente" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="N">Natural</SelectItem>
                                                <SelectItem value="J">Jurídico</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.tipo && (
                                            <p className="text-sm text-red-500">{errors.tipo}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Link href="/admin/clientes">
                                        <Button variant="outline" type="button">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Guardando...' : 'Guardar Cliente'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
