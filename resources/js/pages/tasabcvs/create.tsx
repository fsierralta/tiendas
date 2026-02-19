import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Calendar, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasas BCV',
        href: "/admin/tasabcvs",
    },
    {
        title: 'Crear Tasa BCV',
        href: "#",
    },
];

export default function Create(){
    const { data, setData, post, processing, errors } = useForm({
        fecha: '',
        monto: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tasabcvs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Tasa BCV" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tasabcvs">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Nueva Tasa BCV</h1>
                        <p className="text-muted-foreground mt-2">
                            Completa los datos para registrar una nueva tasa de cambio
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información de la Tasa BCV</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fecha">Fecha *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="fecha"
                                            type="date"
                                            value={data.fecha}
                                            onChange={(e) => setData('fecha', e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.fecha && (
                                        <p className="text-sm text-destructive">{errors.fecha}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="monto">Monto (Bs) *</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="monto"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="99999999.99"
                                            value={data.monto}
                                            onChange={(e) => setData('monto', e.target.value)}
                                            placeholder="0.00"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.monto && (
                                        <p className="text-sm text-destructive">{errors.monto}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Ingresa el valor en Bolívares (Bs)
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/tasabcvs">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Guardar Tasa BCV'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
