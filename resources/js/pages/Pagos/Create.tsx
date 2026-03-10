import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pagos',
        href: '/pagos',
    },
    {
        title: 'Registrar',
        href: '/pagos/create',
    },
];

interface Formapago {
    id: number;
    name: string;
}

interface VentaPendiente {
    id: number;
    monto: number;
    fecha_venta: string;
    descripcion: string;
    [key: string]: any;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
        referencia: '',
        observacion: '',
        formapago_id: '',
        tipo_venta: 'promotor',
        venta_id: '',
    });

    const [ventasPendientes, setVentasPendientes] = useState<VentaPendiente[]>([]);
    const [formapagosList, setFormapagosList] = useState<Formapago[]>([]);

    // Cargar formas de pago al montar
    useEffect(() => {
        fetchFormapagos();
    }, []);

    // Cargar ventas pendientes cuando cambia el tipo
    useEffect(() => {
        if (data.tipo_venta) {
            cargarVentasPendientes(data.tipo_venta);
        }
    }, [data.tipo_venta]);

    const fetchFormapagos = async () => {
        try {
            const response = await fetch('/api/pagos/formas-pago');
            const data = await response.json();
            setFormapagosList(data);
        } catch (error) {
            console.error('Error al cargar formas de pago:', error);
        }
    };

    const cargarVentasPendientes = async (tipo: string) => {
        try {
            const endpoint = tipo === 'promotor' 
                ? '/api/pagos/ventas-pendientes-promotor'
                : '/api/pagos/ventas-pendientes-tecnico';
            
            const response = await fetch(endpoint);
            const ventas = await response.json();
            setVentasPendientes(ventas);
            
            // Limpiar venta_id si ya no existe
            if (data.venta_id && !ventas.find((v: VentaPendiente) => v.id === parseInt(data.venta_id))) {
                setData('venta_id', '');
                setData('monto', '');
            }
        } catch (error) {
            console.error('Error al cargar ventas pendientes:', error);
            setVentasPendientes([]);
        }
    };

    const handleVentaChange = (ventaId: string) => {
        setData('venta_id', ventaId);
        
        // Autocompletar el monto
        const ventaSeleccionada = ventasPendientes.find(v => v.id === parseInt(ventaId));
        if (ventaSeleccionada) {
            setData('monto', ventaSeleccionada.monto.toString());
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            post('/pagos');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/pagos">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Registrar Pago</h1>
                        <p className="text-muted-foreground">
                            Registra un nuevo pago para comisiones de promotor o técnico
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Pago</CardTitle>
                        <CardDescription>
                            Completa los datos para registrar el pago
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tipo_venta" className="text-base font-medium">Tipo de Comisión</Label>
                                    <select
                                        id="tipo_venta"
                                        value={data.tipo_venta}
                                        onChange={(e) => setData('tipo_venta', e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base bg-white text-gray-900"
                                        required
                                    >
                                        <option value="promotor">🎯 Promotor</option>
                                        <option value="tecnico">🔧 Técnico</option>
                                    </select>
                                    {errors.tipo_venta && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> {errors.tipo_venta}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="venta_id" className="text-base font-medium">
                                        {data.tipo_venta === 'promotor' ? '🎯 Comisión Pendiente - Promotor' : '🔧 Comisión Pendiente - Técnico'}
                                    </Label>
                                    <select
                                        id="venta_id"
                                        value={data.venta_id}
                                        onChange={(e) => handleVentaChange(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base bg-white text-gray-900"
                                        required
                                        disabled={ventasPendientes.length === 0}
                                    >
                                        <option value="">
                                            {ventasPendientes.length === 0 
                                                ? '📭 No hay comisiones pendientes' 
                                                : `📋 Selecciona una comisión pendiente (${ventasPendientes.length} disponibles)`
                                            }
                                        </option>
                                        {ventasPendientes.map((venta) => (
                                            <option key={venta.id} value={venta.id} className="py-2">
                                                💰 {venta.descripcion} - <strong>${venta.monto}</strong>
                                            </option>
                                        ))}
                                    </select>
                                    {errors.venta_id && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> {errors.venta_id}
                                        </p>
                                    )}
                                    {ventasPendientes.length > 0 && (
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <span>💡</span> Se encuentran {ventasPendientes.length} comisiones pendientes de pago
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="monto" className="text-base font-medium">💰 Monto a Pagar</Label>
                                    <div className="relative">
                                        <Input
                                            id="monto"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={data.monto}
                                            onChange={(e) => setData('monto', e.target.value)}
                                            placeholder="0.00"
                                            required
                                            readOnly
                                            className="pl-8 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base font-semibold text-green-600 bg-green-50"
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></span>
                                    </div>
                                    {errors.monto && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> {errors.monto}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <span>✨</span> El monto se autocompleta al seleccionar una comisión
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="fecha" className="text-base font-medium">📅 Fecha del Pago</Label>
                                    <Input
                                        id="fecha"
                                        type="date"
                                        value={data.fecha}
                                        onChange={(e) => setData('fecha', e.target.value)}
                                        required
                                        className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base"
                                    />
                                    {errors.fecha && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> {errors.fecha}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="formapago_id" className="text-base font-medium">💳 Forma de Pago</Label>
                                    <select
                                        id="formapago_id"
                                        value={data.formapago_id}
                                        onChange={(e) => setData('formapago_id', e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base bg-white text-gray-900"
                                        required
                                    >
                                        <option value="">💳 Selecciona una forma de pago</option>
                                        {formapagosList.map((formapago) => (
                                            <option key={formapago.id} value={formapago.id}>
                                                💳 {formapago.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.formapago_id && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> {errors.formapago_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="referencia" className="text-base font-medium">🔖 Número de Referencia</Label>
                                    <div className="relative">
                                        <Input
                                            id="referencia"
                                            type="text"
                                            value={data.referencia}
                                            onChange={(e) => setData('referencia', e.target.value)}
                                            placeholder="Ej: 123456789"
                                            className="pl-8 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base"
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600"></span>
                                    </div>
                                    {errors.referencia && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> {errors.referencia}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <span>ℹ️</span> Número de referencia del comprobante de pago
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="observacion" className="text-base font-medium">📝 Notas Adicionales</Label>
                                <div className="relative">
                                    <Textarea
                                        id="observacion"
                                        value={data.observacion}
                                        onChange={(e) => setData('observacion', e.target.value)}
                                        placeholder="Agrega cualquier nota o comentario adicional sobre este pago..."
                                        rows={3}
                                        className="pl-8 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-base resize-none"
                                    />
                                    <span className="absolute left-3 top-3 text-gray-500"></span>
                                </div>
                                {errors.observacion && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <span className="text-xs">⚠️</span> {errors.observacion}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <span>💡</span> Campo opcional para agregar detalles importantes del pago
                                </p>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/pagos">
                                    <Button variant="outline" type="button" className="px-6 py-3 text-base">
                                        ❌ Cancelar
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing || ventasPendientes.length === 0}
                                    className="px-6 py-3 text-base bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            💾 Registrar Pago
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
