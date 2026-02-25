import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface FormaPago {
    id: number;
    name: string;
    descripcion: string;
}

interface FormaPagoItem {
    forma_pago_id: number;
    monto: number;
    referencia: string;
    notas: string;
    forma_pago: FormaPago;
}

interface FormasPagoSelectorProps {
    formasPago: FormaPago[];
    formasPagoItems: FormaPagoItem[];
    totalVenta: number;
    onFormaPagoChange: (index: number, field: string, value: any) => void;
    onAgregarFormaPago: () => void;
    onEliminarFormaPago: (index: number) => void;
}

export default function FormasPagoSelector({
    formasPago,
    formasPagoItems,
    totalVenta,
    onFormaPagoChange,
    onAgregarFormaPago,
    onEliminarFormaPago
}: FormasPagoSelectorProps) {
    
    const totalFormasPago = formasPagoItems.reduce((sum, item) => sum + item.monto, 0);
    const diferencia = totalVenta - totalFormasPago;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Formas de Pago</h3>
                <Button type="button" variant="outline" onClick={onAgregarFormaPago}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Forma de Pago
                </Button>
            </div>

            <div className="space-y-3">
                {formasPagoItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 border rounded-lg">
                        <div className="flex-1 space-y-2">
                            <div>
                                <Label htmlFor={`forma_pago_${index}`}>Forma de Pago</Label>
                                <Select
                                    value={item.forma_pago_id.toString()}
                                    onValueChange={(value) => onFormaPagoChange(index, 'forma_pago_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione forma de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formasPago.map(forma => (
                                            <SelectItem key={forma.id} value={forma.id.toString()}>
                                                {forma.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`monto_${index}`}>Monto</Label>
                                    <Input
                                        id={`monto_${index}`}
                                        type="number"
                                        step="0.01"
                                        value={item.monto}
                                        onChange={(e) => onFormaPagoChange(index, 'monto', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor={`referencia_${index}`}>Referencia</Label>
                                    <Input
                                        id={`referencia_${index}`}
                                        type="text"
                                        value={item.referencia}
                                        onChange={(e) => onFormaPagoChange(index, 'referencia', e.target.value)}
                                        placeholder="N° de referencia"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor={`notas_${index}`}>Notas (opcional)</Label>
                                <Input
                                    id={`notas_${index}`}
                                    type="text"
                                    value={item.notas}
                                    onChange={(e) => onFormaPagoChange(index, 'notas', e.target.value)}
                                    placeholder="Notas adicionales"
                                />
                            </div>
                        </div>

                        {formasPagoItems.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEliminarFormaPago(index)}
                                className="text-red-500 hover:text-red-700 mt-6"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Resumen de formas de pago */}
            <div className="bg-gray-50 border rounded-lg p-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Total de la venta:</span>
                        <span className="font-bold">${totalVenta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Suma de formas de pago:</span>
                        <span className="font-bold">${totalFormasPago.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between font-bold ${diferencia === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span>Diferencia:</span>
                        <span>${diferencia.toFixed(2)}</span>
                    </div>
                </div>
                
                {diferencia !== 0 && (
                    <div className={`mt-2 text-sm ${diferencia > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                        {diferencia > 0 
                            ? 'Falta por distribuir en formas de pago' 
                            : 'Las formas de pago exceden el total de la venta'
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
