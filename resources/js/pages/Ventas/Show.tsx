import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, DollarSign, Package, CreditCard, Users, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Producto {
    id: number;
    name: string;
    precio: number;
    categoria?: { name: string };
}

interface Venta {
    id: number;
    fecha: string;
    monto_total: number;
    monto_promotor?: number;
    cliente: {
        id: number;
        name: string;
        apellido: string;
        cedula_rif: string;
        email?: string;
        telefono?: string;
        direccion?: string;
    };
    promotor?: {
        id: number;
        name: string;
        apellidos: string;
        email?: string;
        celular?: string;
    };
    tecnico?: {
        id: number;
        name: string;
        apellidos: string;
        email?: string;
        celular?: string;
    };
    ventas: Array<{
        id: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        descripcion: string;
        producto: Producto;
    }>;
    ventaFooter: {
        subtotal: number;
        iva: number;
        descuento: number;
        total: number;
    };
    formaPagos: Array<{
        id: number;
        monto: number;
        referencia?: string;
        notas?: string;
        forma_pago: {
            id: number;
            name: string;
            descripcion: string;
        };
    }>;
    locale: {
        id: number;
        name: string;
        direccion: string;
    };
}

const breadcrumbs = [
    {
        title: 'Ventas',
        href: "/ventas",
    },
    {
        title: 'Detalles de Venta',
        href: "#",
    },
];

export default function Show({ venta }: { venta: Venta }) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES'
        }).format(amount);
    };

    const calcularDistribucion = () => {
        const total = venta.ventaFooter.total;
        const tienePromotor = !!venta.promotor;
        const tieneTecnico = !!venta.tecnico;

        if (tienePromotor && tieneTecnico) {
            return {
                tecnico: total * 0.40,
                local: total * 0.30,
                promotor: total * 0.30,
                tipo: '40-30-30'
            };
        } else if (tieneTecnico) {
            return {
                tecnico: total * 0.60,
                negocio: total * 0.40,
                tipo: '60-40'
            };
        } else if (tienePromotor) {
            return {
                promotor: venta.monto_promotor || 0,
                negocio: total - (venta.monto_promotor || 0),
                tipo: 'monto-fijo'
            };
        }
        return null;
    };

    const distribucion = calcularDistribucion();

    return (
        <>
            <Head title={`Venta #${venta.id.toString().padStart(6, '0')}`} />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Venta #{venta.id.toString().padStart(6, '0')}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Detalles completos de la transacción
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/ventas">
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información Principal */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Información de la Venta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Cliente */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Cliente
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Nombre:</span>
                                            <p className="font-medium">{venta.cliente.name} {venta.cliente.apellido}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Cédula/RIF:</span>
                                            <p className="font-medium">{venta.cliente.cedula_rif}</p>
                                        </div>
                                        {venta.cliente.email && (
                                            <div>
                                                <span className="text-muted-foreground">Email:</span>
                                                <p className="font-medium">{venta.cliente.email}</p>
                                            </div>
                                        )}
                                        {venta.cliente.telefono && (
                                            <div>
                                                <span className="text-muted-foreground">Teléfono:</span>
                                                <p className="font-medium">{venta.cliente.telefono}</p>
                                            </div>
                                        )}
                                        {venta.cliente.direccion && (
                                            <div className="md:col-span-2">
                                                <span className="text-muted-foreground">Dirección:</span>
                                                <p className="font-medium">{venta.cliente.direccion}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Participantes */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Participantes
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {venta.promotor && (
                                            <div className="border rounded-lg p-3">
                                                <Badge variant="secondary" className="mb-2">Promotor</Badge>
                                                <div className="text-sm">
                                                    <p className="font-medium">{venta.promotor.name} {venta.promotor.apellidos}</p>
                                                    {venta.promotor.email && <p>{venta.promotor.email}</p>}
                                                    {venta.promotor.celular && <p>{venta.promotor.celular}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {venta.tecnico && (
                                            <div className="border rounded-lg p-3">
                                                <Badge variant="outline" className="mb-2">Técnico</Badge>
                                                <div className="text-sm">
                                                    <p className="font-medium">{venta.tecnico.name} {venta.tecnico.apellidos}</p>
                                                    {venta.tecnico.email && <p>{venta.tecnico.email}</p>}
                                                    {venta.tecnico.celular && <p>{venta.tecnico.celular}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {!venta.promotor && !venta.tecnico && (
                                            <div className="col-span-2 text-muted-foreground text-sm">
                                                No hay participantes asignados a esta venta
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Productos */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Productos Vendidos
                                    </h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Producto</TableHead>
                                                <TableHead className="text-right">Cantidad</TableHead>
                                                <TableHead className="text-right">Precio Unitario</TableHead>
                                                <TableHead className="text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {venta.ventas.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{item.descripcion}</p>
                                                            {item.producto.categoria && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.producto.categoria.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">{item.cantidad}</TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(item.precio_unitario)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {formatCurrency(item.subtotal)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resumen y Pagos */}
                        <div className="space-y-6">
                            {/* Información General */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Información General
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fecha:</span>
                                        <span className="font-medium">{formatDate(venta.fecha)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Local:</span>
                                        <span className="font-medium">{venta.locale.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Estado:</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Completada
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Totales */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5" />
                                        Resumen de Totales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">{formatCurrency(venta.ventaFooter.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>IVA (16%):</span>
                                        <span className="font-medium">{formatCurrency(venta.ventaFooter.iva)}</span>
                                    </div>
                                    {venta.ventaFooter.descuento > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Descuento:</span>
                                            <span className="font-medium">-{formatCurrency(venta.ventaFooter.descuento)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold text-green-600">
                                        <span>Total:</span>
                                        <span>{formatCurrency(venta.ventaFooter.total)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Formas de Pago */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Formas de Pago
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {venta.formaPagos.map((pago, index) => (
                                        <div key={pago.id} className="border rounded-lg p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline">{pago.forma_pago.name}</Badge>
                                                <span className="font-semibold">{formatCurrency(pago.monto)}</span>
                                            </div>
                                            {pago.referencia && (
                                                <p className="text-sm text-muted-foreground">
                                                    Ref: {pago.referencia}
                                                </p>
                                            )}
                                            {pago.notas && (
                                                <p className="text-sm text-muted-foreground">
                                                    {pago.notas}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Distribución de Comisiones */}
                            {distribucion && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Distribución de Comisiones
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-sm text-muted-foreground mb-2">
                                            Tipo: {distribucion.tipo}
                                        </div>
                                        {distribucion.tecnico && (
                                            <div className="flex justify-between">
                                                <span>Técnico:</span>
                                                <span className="font-medium">{formatCurrency(distribucion.tecnico)}</span>
                                            </div>
                                        )}
                                        {distribucion.local && (
                                            <div className="flex justify-between">
                                                <span>Local:</span>
                                                <span className="font-medium">{formatCurrency(distribucion.local)}</span>
                                            </div>
                                        )}
                                        {distribucion.negocio && (
                                            <div className="flex justify-between">
                                                <span>Negocio:</span>
                                                <span className="font-medium">{formatCurrency(distribucion.negocio)}</span>
                                            </div>
                                        )}
                                        {distribucion.promotor && (
                                            <div className="flex justify-between">
                                                <span>Promotor:</span>
                                                <span className="font-medium">{formatCurrency(distribucion.promotor)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="text-xs text-muted-foreground">
                                            Los pagos a técnicos y promotores se generan como pendientes
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
