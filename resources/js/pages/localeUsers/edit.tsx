import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, MapPin, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignación Usuario-Locale',
        href: "/admin/locale-users",
    },
    {
        title: 'Editar Asignación',
        href: "#",
    },
];

export default function Edit({ localeUser, users, locales }: { 
    localeUser: any, 
    users: any[], 
    locales: any[] 
}){
    const { data, setData, put, processing, errors } = useForm({
        id_user: localeUser.id_user?.toString() || '',
        id_locale: localeUser.id_locale?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/locale-users/${localeUser.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Asignación Usuario-Locale" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/locale-users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Editar Asignación</h1>
                        <p className="text-muted-foreground mt-2">
                            Actualiza la asignación de usuario a locale
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información de la Asignación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="id_user">Usuario *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                        <Select value={data.id_user} onValueChange={(value) => setData('id_user', value)}>
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Selecciona un usuario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name} ({user.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.id_user && (
                                        <p className="text-sm text-destructive">{errors.id_user}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_locale">Locale *</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                        <Select value={data.id_locale} onValueChange={(value) => setData('id_locale', value)}>
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Selecciona un locale" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locales.map((locale) => (
                                                    <SelectItem key={locale.id} value={locale.id.toString()}>
                                                        {locale.name} ({locale.ciudad})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.id_locale && (
                                        <p className="text-sm text-destructive">{errors.id_locale}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/locale-users">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Actualizando...' : 'Actualizar Asignación'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
