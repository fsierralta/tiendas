import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Minus } from 'lucide-react';

interface VentaItem {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    descripcion: string;
    producto: {
        id: number;
        name: string;
        precio: number | string;
        cantidad: number;
        categoria?: { name: string };
        ubicacion?: { name: string };
    };
    monto_promotor?: number;
    precio_venta?: number;
}

interface CarritoVentasProps {
    ventaItems: VentaItem[];
    onCantidadChange: (index: number, cantidad: number) => void;
    onEliminarItem: (index: number) => void;
    onMontoPromotorChange?: (index: number, montoPromotor: number) => void;
    onPrecioUnitarioChange?: (index: number, precioUnitario: number) => void;
    selectedPromotor?: string;
    selectedTecnico?: string;
}

export default function CarritoVentas({ 
    ventaItems, 
    onCantidadChange, 
    onEliminarItem,
    onMontoPromotorChange,
    onPrecioUnitarioChange,
    selectedPromotor,
    selectedTecnico
}: CarritoVentasProps) {
    
    const toNumber = (value: any): number => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const subtotal = ventaItems.reduce((sum, item) => sum + item.subtotal, 0);

    if (ventaItems.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No hay productos agregados al carrito</p>
                <p className="text-sm text-gray-400 mt-2">Busca y agrega productos para comenzar</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {ventaItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.producto.name}</h4>
                            <p className="text-xs text-muted-foreground">
                                {item.producto.categoria?.name} - Base: ${toNumber(item.producto.precio).toFixed(2)} c/u
                            </p>
                            {selectedPromotor && !selectedTecnico && (
                                <p className="text-xs text-green-600">
                                    + ${toNumber(item.monto_promotor || 0).toFixed(2)} promotor = ${toNumber(item.precio_venta || 0).toFixed(2)} total
                                </p>
                            )}
                            {selectedTecnico && (
                                <p className="text-xs text-blue-600">
                                    Precio técnico: ${toNumber(item.precio_venta || 0).toFixed(2)} c/u
                                </p>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onCantidadChange(index, item.cantidad - 1)}
                                    disabled={item.cantidad <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                
                                <Input
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(e) => {
                                        const nuevaCantidad = parseInt(e.target.value) || 1;
                                        if (nuevaCantidad > 0 && nuevaCantidad <= item.producto.cantidad) {
                                            onCantidadChange(index, nuevaCantidad);
                                        }
                                    }}
                                    className="w-16 text-center"
                                    min="1"
                                    max={item.producto.cantidad}
                                />
                                
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onCantidadChange(index, item.cantidad + 1)}
                                    disabled={item.cantidad >= item.producto.cantidad}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                            
                            {/* Inputs adicionales según el participante */}
                            {selectedPromotor && !selectedTecnico && onMontoPromotorChange && (
                                <div className="flex items-center gap-1">
                                    <Label className="text-xs">Promotor:</Label>
                                    <Input
                                        type="number"
                                        value={item.monto_promotor || 0}
                                        onChange={(e) => {
                                            const monto = parseFloat(e.target.value) || 0;
                                            onMontoPromotorChange(index, monto);
                                        }}
                                        className="w-20 text-center"
                                        min="0"
                                        max={toNumber(item.producto.precio)}
                                        step="0.01"
                                    />
                                </div>
                            )}
                            
                            {selectedTecnico && onPrecioUnitarioChange && (
                                <div className="flex items-center gap-1">
                                    <Label className="text-xs">Precio:</Label>
                                    <Input
                                        type="number"
                                        value={item.precio_unitario || toNumber(item.producto.precio)}
                                        onChange={(e) => {
                                            const precio = parseFloat(e.target.value) || 0;
                                            onPrecioUnitarioChange(index, precio);
                                        }}
                                        className="w-20 text-center"
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>
                            )}
                            
                            <div className="text-right min-w-20">
                                <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">
                                    Stock: {item.producto.cantidad}
                                </p>
                            </div>
                            
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEliminarItem(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Resumen del carrito */}
            <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal del carrito:</span>
                    <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    {ventaItems.length} producto{ventaItems.length !== 1 ? 's' : ''} en el carrito
                </p>
            </div>
        </div>
    );
}
