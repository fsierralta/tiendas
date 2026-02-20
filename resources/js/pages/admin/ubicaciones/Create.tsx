import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X, MapPin } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Locale {
    id: number;
    name: string;
}

interface Props {
    locales: Locale[];
}

export default function Create({ locales }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        id_locales: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/ubicaciones', {
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
            <Head title="Nueva Ubicación" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Nueva Ubicación</h1>
                        <p className="text-muted-foreground">
                            Registra una nueva ubicación de almacenamiento
                        </p>
                    </div>
                    <Link href="/admin/ubicaciones">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Ubicación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre de la Ubicación *</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ingrese el nombre de la ubicación"
                                            className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_locales">Locale *</Label>
                                    <Select
                                        value={data.id_locales}
                                        onValueChange={(value) => setData('id_locales', value)}
                                    >
                                        <SelectTrigger className={errors.id_locales ? 'border-red-500' : ''}>
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
                                    {errors.id_locales && (
                                        <p className="text-sm text-red-500">{errors.id_locales}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar
                                </Button>
                                <Link href="/admin/ubicaciones">
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
