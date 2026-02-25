import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';

interface Totales {
    subtotal: number;
    iva: number;
    descuento: number;
    total: number;
}

interface ResumenVentasProps {
    totales: Totales;
    ivaRate: number;
    descuento: number;
    onDescuentoChange: (value: number) => void;
    totalPromotor?: number;
    selectedPromotor?: string;
    selectedTecnico?: string;
}

export default function ResumenVentas({ 
    totales, 
    ivaRate, 
    descuento, 
    onDescuentoChange,
    totalPromotor = 0,
    selectedPromotor,
    selectedTecnico
}: ResumenVentasProps) {
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Resumen de la Venta
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Campo de descuento */}
                    <div>
                        <Label htmlFor="descuento">Descuento</Label>
                        <Input
                            id="descuento"
                            type="number"
                            step="0.01"
                            value={descuento}
                            onChange={(e) => onDescuentoChange(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                        />
                    </div>

                    {/* Resumen de totales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">Subtotal</Label>
                            <p className="text-2xl font-bold">${totales.subtotal.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">IVA ({ivaRate}%)</Label>
                            <p className="text-2xl font-bold">${totales.iva.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Descuento</Label>
                            <p className="text-2xl font-bold text-red-600">-${totales.descuento.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Total</Label>
                            <p className="text-2xl font-bold text-green-600">${totales.total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Información de la venta:</span>
                        </p>
                        <div className="text-xs text-blue-600 mt-1 space-y-1">
                            <p>• Subtotal: ${totales.subtotal.toFixed(2)}</p>
                            <p>• IVA ({ivaRate}%): ${totales.iva.toFixed(2)}</p>
                            <p>• Descuento: ${totales.descuento.toFixed(2)}</p>
                            <p>• Total a pagar: ${totales.total.toFixed(2)}</p>
                            {selectedPromotor && !selectedTecnico && totalPromotor > 0 && (
                                <p className="text-green-700 font-medium">• Comisión del promotor: ${totalPromotor.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
