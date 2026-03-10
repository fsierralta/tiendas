import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

interface Totales {
    total_pagado: string;
    total_promotores: string;
    total_tecnicos: string;
}

interface PagosSummaryProps {
    totales: Totales;
}

export default function PagosSummary({ totales }: PagosSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Resumen de Pagos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Total General</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            ${parseFloat(totales.total_pagado).toFixed(2)}
                        </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Total Promotores</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                            ${parseFloat(totales.total_promotores).toFixed(2)}
                        </div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-medium text-orange-600">Total Técnicos</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                            ${parseFloat(totales.total_tecnicos).toFixed(2)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
