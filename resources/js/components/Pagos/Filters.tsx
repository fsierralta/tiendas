import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';

interface Filters {
    fecha_inicio?: string;
    fecha_fin?: string;
    tipo?: string;
    responsable?: string;
}

interface PagosFiltersProps {
    filters: Filters;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export default function PagosFilters({ 
    filters, 
    onFilterChange, 
    onApplyFilters, 
    onClearFilters 
}: PagosFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros de Búsqueda
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <Label htmlFor="fecha_inicio" className="text-sm font-medium">📅 Fecha Inicio</Label>
                        <Input
                            id="fecha_inicio"
                            type="date"
                            value={filters.fecha_inicio || ''}
                            onChange={(e) => onFilterChange('fecha_inicio', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="fecha_fin" className="text-sm font-medium">📅 Fecha Fin</Label>
                        <Input
                            id="fecha_fin"
                            type="date"
                            value={filters.fecha_fin || ''}
                            onChange={(e) => onFilterChange('fecha_fin', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="tipo" className="text-sm font-medium">🎯 Tipo</Label>
                        <select
                            id="tipo"
                            value={filters.tipo || ''}
                            onChange={(e) => onFilterChange('tipo', e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md bg-white text-gray-900"
                        >
                            <option value="">Todos</option>
                            <option value="promotor">🎯 Promotor</option>
                            <option value="tecnico">🔧 Técnico</option>
                        </select>
                    </div>
                    
                    <div>
                        <Label htmlFor="responsable" className="text-sm font-medium">👤 Responsable</Label>
                        <Input
                            id="responsable"
                            type="text"
                            value={filters.responsable || ''}
                            onChange={(e) => onFilterChange('responsable', e.target.value)}
                            placeholder="Nombre del responsable"
                            className="mt-1"
                        />
                    </div>
                    
                    <div className="flex items-end gap-2">
                        <Button onClick={onApplyFilters} className="flex-1">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrar
                        </Button>
                        <Button onClick={onClearFilters} variant="outline">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Limpiar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
