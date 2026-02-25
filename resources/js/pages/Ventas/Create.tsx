import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

// Importar nuevos componentes
import ClienteSelector from '@/components/ventas/ClienteSelector';
import ProductoSelector from '@/components/ventas/ProductoSelector';
import ParticipanteSelector from '@/components/ventas/ParticipanteSelector';
import CarritoVentas from '@/components/ventas/CarritoVentas';
import FormasPagoSelector from '@/components/ventas/FormasPagoSelector';
import ResumenVentas from '@/components/ventas/ResumenVentas';

interface Producto {
    id: number;
    name: string;
    precio: number | string;
    cantidad: number;
    categoria?: { name: string };
    ubicacion?: { name: string };
}

interface FormaPago {
    id: number;
    name: string;
    descripcion: string;
}

interface Cliente {
    id: number;
    name: string;
    apellido: string;
    cedula_rif: string;
    email?: string;
    telefono?: string;
}

interface Promotor {
    id: number;
    name: string;
    apellidos: string;
    email?: string;
    celular?: string;
}

interface Tecnico {
    id: number;
    name: string;
    apellidos: string;
    email?: string;
    celular?: string;
}

interface VentaItem {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    descripcion: string;
    producto: Producto;
    monto_promotor?: number;
    precio_venta?: number;
}

interface FormaPagoItem {
    forma_pago_id: number;
    monto: number;
    referencia: string;
    notas: string;
    forma_pago: FormaPago;
}

export default function Create({ productos, formasPago, clientes, promotores, tecnicos, ivaRate }: { 
    productos: Producto[], 
    formasPago: FormaPago[], 
    clientes: Cliente[],
    promotores: Promotor[],
    tecnicos: Tecnico[],
    ivaRate: number
}) {
    const [ventaItems, setVentaItems] = useState<VentaItem[]>([]);
    const [formasPagoItems, setFormasPagoItems] = useState<FormaPagoItem[]>([
        { forma_pago_id: 0, monto: 0, referencia: '', notas: '', forma_pago: { id: 0, name: '', descripcion: '' } }
    ]);
    console.log(ventaItems);
    console.log(formasPagoItems)
    const { data, setData, post, processing, errors } = useForm({
        id_cliente: '',
        id_promotor: '',
        id_tecnico: '',
        monto_promotor: '',
        descuento: 0,
        productos: [] as VentaItem[],
        formas_pago: [] as FormaPagoItem[],
    });
      console.log(errors);
    // Helper functions
    const toNumber = (value: any): number => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    // Calcular totales cuando cambian los productos
    const totales = {
        subtotal: ventaItems.reduce((sum, item) => sum + item.subtotal, 0),
        iva: ventaItems.reduce((sum, item) => sum + item.subtotal, 0) * (ivaRate / 100),
        descuento: data.descuento || 0,
        total: 0
    };
    totales.total = totales.subtotal + totales.iva - totales.descuento;

    // Calcular total ganado por el promotor
    const totalPromotor = ventaItems.reduce((sum, item) => sum + (item.monto_promotor || 0), 0) * (data.id_promotor && !data.id_tecnico ? 1 : 0);

    // Event handlers
    const agregarProducto = (producto: Producto) => {
        const existingIndex = ventaItems.findIndex(item => item.id_producto === producto.id);
        
        if (existingIndex >= 0) {
            const updated = [...ventaItems];
            const nuevaCantidad = updated[existingIndex].cantidad + 1;
            
            if (nuevaCantidad <= producto.cantidad) {
                updated[existingIndex].cantidad = nuevaCantidad;
                updated[existingIndex].subtotal = nuevaCantidad * (updated[existingIndex].precio_venta || toNumber(producto.precio));
                setVentaItems(updated);
            }
        } else {
            const nuevoItem: VentaItem = {
                id_producto: producto.id,
                cantidad: 1,
                precio_unitario: toNumber(producto.precio),
                subtotal: toNumber(producto.precio),
                descripcion: producto.name,
                producto: producto,
                monto_promotor: 0,
                precio_venta: toNumber(producto.precio)
            };
            setVentaItems([...ventaItems, nuevoItem]);
        }
    };

    const actualizarCantidad = (index: number, cantidad: number) => {
        const updated = [...ventaItems];
        const item = updated[index];
        
        if (cantidad > 0 && cantidad <= item.producto.cantidad) {
            updated[index].cantidad = cantidad;
            updated[index].subtotal = cantidad * (item.precio_venta || item.precio_unitario);
            setVentaItems(updated);
        }
    };

    const actualizarMontoPromotor = (index: number, montoPromotor: number) => {
        const updated = [...ventaItems];
        const item = updated[index];
        
        // Validar que el monto del promotor no supere el precio del producto
        if (montoPromotor <= toNumber(item.producto.precio)) {
            updated[index].monto_promotor = montoPromotor;
            const precioVenta = toNumber(item.producto.precio) + montoPromotor;
            updated[index].precio_venta = precioVenta;
            updated[index].subtotal = item.cantidad * precioVenta;
            setVentaItems(updated);
        }
    };

    const actualizarPrecioUnitario = (index: number, precioUnitario: number) => {
        const updated = [...ventaItems];
        const item = updated[index];
        
        if (precioUnitario > 0) {
            updated[index].precio_unitario = precioUnitario;
            updated[index].precio_venta = precioUnitario;
            updated[index].subtotal = item.cantidad * precioUnitario;
            setVentaItems(updated);
        }
    };

    const eliminarItem = (index: number) => {
        setVentaItems(ventaItems.filter((_, i) => i !== index));
    };

    const agregarFormaPago = () => {
        setFormasPagoItems([
            ...formasPagoItems,
            { forma_pago_id: 0, monto: 0, referencia: '', notas: '', forma_pago: { id: 0, name: '', descripcion: '' } }
        ]);
    };

    const actualizarFormaPago = (index: number, field: string, value: any) => {
        const updated = [...formasPagoItems];
        updated[index] = { ...updated[index], [field]: value };
        
        // Actualizar forma_pago si cambia el ID
        if (field === 'forma_pago_id') {
            const formaPago = formasPago.find(fp => fp.id === value);
            if (formaPago) {
                updated[index].forma_pago = formaPago;
            }
        }
        
        setFormasPagoItems(updated);
    };

    const eliminarFormaPago = (index: number) => {
        setFormasPagoItems(formasPagoItems.filter((_, i) => i !== index));
    };

    // Actualizar formas de pago cuando cambia el total
    useEffect(() => {
        if (formasPagoItems.length === 1 && formasPagoItems[0].monto === 0 && totales.total > 0) {
            const updated = [...formasPagoItems];
            updated[0].monto = totales.total;
            setFormasPagoItems(updated);
        }
    }, [totales.total]);

    // Actualizar datos del formulario
    useEffect(() => {
        setData('productos', ventaItems);
        setData('formas_pago', formasPagoItems);
    }, [ventaItems, formasPagoItems]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = {
            id_cliente: data.id_cliente,
            id_promotor: data.id_promotor,
            id_tecnico: data.id_tecnico,
            descuento: data.descuento,
            productos: ventaItems,
            formas_pago: formasPagoItems
        };

        router.post('/ventas', formData as any);
    };

    return (
        <>
            <Head title="Nueva Venta" />
            <AppLayout breadcrumbs={[
                { title: 'Ventas', href: "/ventas" },
                { title: 'Nueva Venta', href: "#" },
            ]}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Nueva Venta</h1>
                            <p className="text-muted-foreground mt-2">
                                Registra una nueva venta en el sistema
                            </p>
                        </div>
                        <Link href="/ventas">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Información General */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información General</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ClienteSelector
                                        clientes={clientes}
                                        selectedCliente={data.id_cliente}
                                        onClienteChange={(value) => setData('id_cliente', value)}
                                        error={errors.id_cliente}
                                    />

                                    <ParticipanteSelector
                                        promotores={promotores}
                                        tecnicos={tecnicos}
                                        selectedPromotor={data.id_promotor}
                                        selectedTecnico={data.id_tecnico}
                                        montoPromotor={data.monto_promotor}
                                        onPromotorChange={(value) => setData('id_promotor', value)}
                                        onTecnicoChange={(value) => setData('id_tecnico', value)}
                                        onMontoPromotorChange={(value) => setData('monto_promotor', value)}
                                    />
                                </CardContent>
                            </Card>

                            {/* Productos y Carrito */}
                            <div className="lg:col-span-2 space-y-6">
                                <ProductoSelector
                                    productos={productos}
                                    onProductoAdd={agregarProducto}
                                />

                                <CarritoVentas
                                    ventaItems={ventaItems}
                                    onCantidadChange={actualizarCantidad}
                                    onEliminarItem={eliminarItem}
                                    onMontoPromotorChange={actualizarMontoPromotor}
                                    onPrecioUnitarioChange={actualizarPrecioUnitario}
                                    selectedPromotor={data.id_promotor}
                                    selectedTecnico={data.id_tecnico}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Formas de Pago */}
                            <FormasPagoSelector
                                formasPago={formasPago}
                                formasPagoItems={formasPagoItems}
                                totalVenta={totales.total}
                                onFormaPagoChange={actualizarFormaPago}
                                onAgregarFormaPago={agregarFormaPago}
                                onEliminarFormaPago={eliminarFormaPago}
                            />

                            {/* Resumen */}
                            <ResumenVentas
                                totales={totales}
                                ivaRate={ivaRate}
                                descuento={data.descuento}
                                onDescuentoChange={(value) => setData('descuento', value)}
                                totalPromotor={totalPromotor}
                                selectedPromotor={data.id_promotor}
                                selectedTecnico={data.id_tecnico}
                            />
                        </div>

                        {/* Botón de envío */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing || ventaItems.length === 0 || !data.id_cliente}
                                className="px-8"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Procesando...' : 'Guardar Venta'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
