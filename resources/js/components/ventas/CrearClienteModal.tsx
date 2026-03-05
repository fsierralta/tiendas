import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, UserPlus } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface Cliente {
    id: number;
    name: string;
    apellido: string;
    cedula_rif: string;
    email?: string;
    telefono?: string;
    ciudad?: string;
    direccion?: string;
    tipo?: string;
}

interface CrearClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClienteCreado: (cliente: Cliente) => void;
}

export default function CrearClienteModal({ isOpen, onClose, onClienteCreado }: CrearClienteModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        apellido: '',
        cedula_rif: '',
        email: '',
        telefono: '',
        ciudad: '',
        direccion: '',
        tipo: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFormData({
            name: '',
            apellido: '',
            cedula_rif: '',
            email: '',
            telefono: '',
            ciudad: '',
            direccion: '',
            tipo: ''
        });
        setErrors({});
    };

    const handleSubmit = async () => {
        console.log('🔍 handleSubmit iniciado');
        console.log('📋 formData:', formData);
        
        setLoading(true);
        setErrors({});

        try {
            console.log('🚀 Enviando petición con axios...');
            console.log('📋 Datos a enviar:', formData);
            
            const response = await axios.post('/ventas/api/crear-cliente', formData);

            console.log('✅ Respuesta recibida:', response.data);
            const result = response.data;

            if (result.success) {
                onClienteCreado(result.cliente);
                resetForm();
                onClose();
            } else {
                setErrors(result.errors || {});
            }
        } catch (error: any) {
            console.error('❌ Error al crear cliente:', error);
            
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 422 && data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ 
                        general: data.message || `Error del servidor (${status})` 
                    });
                }
            } else if (error.request) {
                setErrors({ general: 'Error de conexión. Verifica tu internet.' });
            } else {
                setErrors({ general: 'Error inesperado al crear el cliente' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Crear Nuevo Cliente
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4" onSubmit={handleSubmit}>
                            {/* Mensaje de error general */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {errors.general}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Nombre del cliente"
                                        className={errors.name ? 'border-red-500' : ''}
                                        disabled={loading}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido *</Label>
                                    <Input
                                        id="apellido"
                                        name="apellido"
                                        type="text"
                                        value={formData.apellido}
                                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                                        placeholder="Apellido del cliente"
                                        className={errors.apellido ? 'border-red-500' : ''}
                                        disabled={loading}
                                    />
                                    {errors.apellido && (
                                        <p className="text-sm text-red-500">{errors.apellido}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cedula_rif">Cédula/RIF *</Label>
                                <Input
                                    id="cedula_rif"
                                    name="cedula_rif"
                                    type="text"
                                    value={formData.cedula_rif}
                                    onChange={(e) => handleInputChange('cedula_rif', e.target.value)}
                                    placeholder="V-12345678 o J-123456789"
                                    className={errors.cedula_rif ? 'border-red-500' : ''}
                                    disabled={loading}
                                />
                                {errors.cedula_rif && (
                                    <p className="text-sm text-red-500">{errors.cedula_rif}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo *</Label>
                                <Input
                                    id="tipo"
                                    name="tipo"
                                    type="text"
                                    value={formData.tipo}
                                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                                    placeholder="V, E, J, G, etc."
                                    maxLength={1}
                                    className={errors.tipo ? 'border-red-500' : ''}
                                    disabled={loading}
                                />
                                {errors.tipo && (
                                    <p className="text-sm text-red-500">{errors.tipo}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                                        placeholder="+58 412 1234567"
                                        className={errors.telefono ? 'border-red-500' : ''}
                                        disabled={loading}
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-500">{errors.telefono}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ciudad">Ciudad</Label>
                                <Input
                                    id="ciudad"
                                    name="ciudad"
                                    type="text"
                                    value={formData.ciudad}
                                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                                    placeholder="Ciudad del cliente"
                                    className={errors.ciudad ? 'border-red-500' : ''}
                                    disabled={loading}
                                />
                                {errors.ciudad && (
                                    <p className="text-sm text-red-500">{errors.ciudad}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    value={formData.direccion}
                                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                                    placeholder="Dirección completa"
                                    className={errors.direccion ? 'border-red-500' : ''}
                                    disabled={loading}
                                />
                                {errors.direccion && (
                                    <p className="text-sm text-red-500">{errors.direccion}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Creando...' : 'Crear Cliente'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
