import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, CreditCard, FileText } from 'lucide-react';

interface Formapago {
    id: number;
    name: string;
    descripcion?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Formas de Pago',
        href: "/admin/formapagos",
    },
    {
        title: 'Editar Forma de Pago',
        href: "#",
    },
];

export default function Edit({ formapago }: { formapago: Formapago }){
    const { data, setData, put, processing, errors } = useForm({
        name: formapago.name || '',
        descripcion: formapago.descripcion || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/formapagos/${formapago.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Forma de Pago" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/formapagos">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Editar Forma de Pago</h1>
                        <p className="text-muted-foreground mt-2">
                            Actualiza la información de la forma de pago
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información de la Forma de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Nombre de la Forma de Pago *</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ej: Tarjeta de Crédito"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', (e.target as HTMLTextAreaElement).value)}
                                    placeholder="Describe los detalles de esta forma de pago..."
                                    rows={4}
                                    className="w-full p-3 border border-input bg-background text-sm ring-offset-background file:ring-2 file:ring-ring file:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-destructive">{errors.descripcion}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/formapagos">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Actualizando...' : 'Actualizar Forma de Pago'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
