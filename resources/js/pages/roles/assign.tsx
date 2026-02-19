import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Plus, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/admin/roles',
    },
    {
        title: 'Asignar Roles',
        href: '#',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Role {
    id: number;
    name: string;
    descripcion: string;
}

export default function Assign() {
    const { users, roles } = usePage().props as any;
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleAssign = () => {
        if (!selectedUser || !selectedRole) {
            return;
        }

        router.post('/admin/roles/assignRole', {
            user_id: selectedUser,
            role_id: selectedRole,
        }, {
            onSuccess: () => {
                setSelectedUser('');
                setSelectedRole('');
            },
        });
    };

    const handleRevoke = (userId: number, roleId: number) => {
        if (confirm('¿Estás seguro de revocar este rol?')) {
            router.post('/admin/roles/revoke', {
                user_id: userId,
                role_id: roleId,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8" />
                        Asignación de Roles
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona los roles asignados a los usuarios del sistema
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Asignar Nuevo Rol
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Usuario</label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user: User) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name} ({user.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Rol</label>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role: Role) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button 
                                onClick={handleAssign}
                                disabled={!selectedUser || !selectedRole}
                                className="flex items-center gap-2"
                            >
                                <UserCheck className="w-4 h-4" />
                                Asignar Rol
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Usuarios y sus Roles
                            </span>
                            <Badge variant="secondary">
                                {users.length} usuarios
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((user: User) => (
                                <div key={user.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role: Role) => (
                                                    <Badge 
                                                        key={role.id} 
                                                        variant="default"
                                                        className="flex items-center gap-1"
                                                    >
                                                        {role.name}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-auto p-0 hover:bg-transparent"
                                                            onClick={() => handleRevoke(user.id, role.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="outline">Sin roles asignados</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
