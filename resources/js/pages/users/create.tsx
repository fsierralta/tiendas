import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Users, Shield, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Usuarios',
        href: '/admin/users',
    },
    {
        title: 'Nuevo Usuario',
        href: '#',
    },
];

interface Role {
    id: number;
    name: string;
    descripcion: string;
}

export default function Create() {
    const { roles } = usePage().props as any;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post('/admin/users', formData, {
            onError: (errors) => setErrors(errors),
        });
    };

    const handleRoleChange = (roleId: number, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            roles: checked 
                ? [...prev.roles, roleId]
                : prev.roles.filter(id => id !== roleId)
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Users className="w-8 h-8" />
                            Nuevo Usuario
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Crea un nuevo usuario para el sistema
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Nombre
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Nombre completo"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Contraseña
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Confirmar Contraseña
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                                        placeholder="Repite la contraseña"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-destructive">{errors.password_confirmation[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="flex items-center gap-2 text-base font-medium">
                                    <Shield className="w-4 h-4" />
                                    Roles del Usuario
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {roles.map((role: Role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={formData.roles.includes(role.id)}
                                                onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                                            />
                                            <Label htmlFor={`role-${role.id}`} className="text-sm">
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.roles && (
                                    <p className="text-sm text-destructive">{errors.roles[0]}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link href="/admin/users">
                                    <Button variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Crear Usuario
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
