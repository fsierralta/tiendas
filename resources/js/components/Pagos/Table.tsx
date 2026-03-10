import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CalendarDays, FileText, User } from 'lucide-react';

interface Pago {
    id: number;
    monto: string;
    fecha: string;
    referencia?: string;
    observacion?: string;
    venta_promotore_id?: number;
    venta_tecnico_id?: number;
    user?: { name: string };
    formapago?: { name: string };
    created_at: string;
}

interface PaginatedData {
    data: Pago[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface PagosTableProps {
    pagos: PaginatedData;
    onPageChange: (page: number, filters: any) => void;
    filters: any;
}

export default function PagosTable({ pagos, onPageChange, filters }: PagosTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Listado de Pagos
                    </span>
                    <Badge variant="secondary">
                        {pagos.total} registros
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-3 font-medium">ID</th>
                                <th className="text-left p-3 font-medium">Fecha</th>
                                <th className="text-left p-3 font-medium">Responsable</th>
                                <th className="text-left p-3 font-medium">Monto</th>
                                <th className="text-left p-3 font-medium">Forma Pago</th>
                                <th className="text-left p-3 font-medium">Dirigido A</th>
                                <th className="text-left p-3 font-medium">Referencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagos.data.length > 0 ? (
                                pagos.data.map((pago) => (
                                    <tr key={pago.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-3 font-mono text-sm">{pago.id}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>{pago.fecha}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span>{pago.user?.name || 'Sistema'}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-green-600">
                                            ${pago.monto}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                <span>{pago.formapago?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {pago.venta_promotore_id ? (
                                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                                    🎯 Promotor Venta #{pago.venta_promotore_id}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                    🔧 Técnico Venta #{pago.venta_tecnico_id}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-3 text-muted-foreground font-mono text-sm">
                                            {pago.referencia || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                                        No se encontraron pagos con los filtros seleccionados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagos.last_page > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {pagos.from} a {pagos.to} de {pagos.total} registros
                        </div>
                        <div className="flex gap-2">
                            {pagos.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(pagos.current_page - 1, filters)}
                                >
                                    Anterior
                                </Button>
                            )}
                            <span className="px-3 py-1 text-sm">
                                Página {pagos.current_page} de {pagos.last_page}
                            </span>
                            {pagos.current_page < pagos.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(pagos.current_page + 1, filters)}
                                >
                                    Siguiente
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
