import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Percent } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comisiones',
        href: "/admin/comisiones",
    },
    {
        title: 'Editar Comisión',
        href: "#",
    },
];

interface Comision {
    id: number;
    name: string;
    porcentaje: number;
    id_locale: number;
    locale?: {
        id: number;
        name: string;
    };
}

interface Locale {
    id: number;
    name: string;
}

export default function Edit({ comision, locales }: { comision: Comision; locales: Locale[] }){
    const { data, setData, put, processing, errors } = useForm({
        name: comision.name || '',
        porcentaje: comision.porcentaje?.toString() || '',
        id_locale: comision.id_locale?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/comisiones/${comision.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Comisión" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/comisiones">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Editar Comisión</h1>
                        <p className="text-muted-foreground mt-2">
                            Actualiza la información de la comisión
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información de la Comisión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la Comisión *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Comisión de Ventas"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id_locale">Local *</Label>
                                <Select
                                    value={data.id_locale}
                                    onValueChange={(value: string) => setData('id_locale', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un local" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locales.map((locale) => (
                                            <SelectItem key={locale.id} value={locale.id.toString()}>
                                                {locale.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.id_locale && (
                                    <p className="text-sm text-destructive">{errors.id_locale}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="porcentaje">Porcentaje *</Label>
                                <div className="relative">
                                    <Input
                                        id="porcentaje"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.porcentaje}
                                        onChange={(e) => setData('porcentaje', e.target.value)}
                                        placeholder="Ej: 10.50"
                                        required
                                        className="pr-8"
                                    />
                                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Ingresa el porcentaje de comisión (0-100%)
                                </p>
                                {errors.porcentaje && (
                                    <p className="text-sm text-destructive">{errors.porcentaje}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/comisiones">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Actualizando...' : 'Actualizar Comisión'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
