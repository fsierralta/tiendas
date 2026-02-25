import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface ParticipanteSelectorProps {
    promotores: Promotor[];
    tecnicos: Tecnico[];
    selectedPromotor: string;
    selectedTecnico: string;
    montoPromotor: string;
    onPromotorChange: (value: string) => void;
    onTecnicoChange: (value: string) => void;
    onMontoPromotorChange: (value: string) => void;
}

// Helper para determinar si hay participantes
const hayParticipantes = (promotor: string, tecnico: string) => {
    const hayPromotor = promotor && promotor !== "none";
    const hayTecnico = tecnico && tecnico !== "none";
    return hayPromotor || hayTecnico;
};

// Helper para determinar tipo de distribución
const getTipoDistribucion = (promotor: string, tecnico: string) => {
    const hayPromotor = promotor && promotor !== "none";
    const hayTecnico = tecnico && tecnico !== "none";
    
    if (hayPromotor && hayTecnico) return '40-30-30';
    if (hayTecnico) return '60-40';
    if (hayPromotor) return 'monto-fijo';
    return null;
};

export default function ParticipanteSelector({
    promotores,
    tecnicos,
    selectedPromotor,
    selectedTecnico,
    montoPromotor,
    onPromotorChange,
    onTecnicoChange,
    onMontoPromotorChange
}: ParticipanteSelectorProps) {
    
    const tipoDistribucion = getTipoDistribucion(selectedPromotor, selectedTecnico);
    const participantes = hayParticipantes(selectedPromotor, selectedTecnico);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="id_promotor">Promotor</Label>
                    <Select
                        value={selectedPromotor || "none"}
                        onValueChange={(value) => onPromotorChange(value === "none" ? "" : value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un promotor (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin promotor</SelectItem>
                            {promotores.map(promotor => (
                                <SelectItem key={promotor.id} value={promotor.id.toString()}>
                                    {promotor.name} {promotor.apellidos}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="id_tecnico">Técnico</Label>
                    <Select
                        value={selectedTecnico || "none"}
                        onValueChange={(value) => onTecnicoChange(value === "none" ? "" : value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un técnico (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin técnico</SelectItem>
                            {tecnicos.map(tecnico => (
                                <SelectItem key={tecnico.id} value={tecnico.id.toString()}>
                                    {tecnico.name} {tecnico.apellidos}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Mostrar información de distribución */}
            {participantes && tipoDistribucion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800">
                        Distribución de comisiones: <span className="font-bold">{tipoDistribucion}</span>
                    </p>
                    <div className="text-xs text-blue-600 mt-1">
                        {tipoDistribucion === '40-30-30' && 'Técnico 40% - Local 30% - Promotor 30%'}
                        {tipoDistribucion === '60-40' && 'Técnico 60% - Local 40%'}
                        {tipoDistribucion === 'monto-fijo' && 'Promotor recibe monto fijo definido'}
                    </div>
                </div>
            )}

            {/* Campo para monto del promotor (solo cuando hay promotor sin técnico) */}
            {selectedPromotor && selectedPromotor !== "none" && !selectedTecnico && (
                <div className="space-y-2">
                    <Label htmlFor="monto_promotor">Monto Promotor</Label>
                    <Input
                        id="monto_promotor"
                        type="number"
                        step="0.01"
                        value={montoPromotor}
                        onChange={(e) => onMontoPromotorChange(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            )}
        </div>
    );
}
