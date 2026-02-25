import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus } from 'lucide-react';
import CrearClienteModal from './CrearClienteModal';

interface Cliente {
    id: number;
    name: string;
    apellido: string;
    cedula_rif: string;
    email?: string;
    telefono?: string;
}

interface ClienteSelectorProps {
    clientes: Cliente[];
    selectedCliente: string;
    onClienteChange: (value: string) => void;
    error?: string;
}

// Helper para debounce
const useDebounce = (callback: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    };
};

export default function ClienteSelector({ 
    clientes, 
    selectedCliente, 
    onClienteChange, 
    error 
}: ClienteSelectorProps) {
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [busquedaApellido, setBusquedaApellido] = useState('');
    const [busquedaCedula, setBusquedaCedula] = useState('');
    const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);

    // Función de búsqueda con debounce
    const buscarClientes = useDebounce(async (nombre: string, apellido: string, cedula: string) => {
        if (!nombre.trim() && !apellido.trim() && !cedula.trim()) {
            setClientesFiltrados([]);
            return;
        }

        setBuscando(true);
        try {
            const params = new URLSearchParams();
            if (nombre.trim()) params.append('nombre', nombre);
            if (apellido.trim()) params.append('apellido', apellido);
            if (cedula.trim()) params.append('cedula_rif', cedula);

            const response = await fetch(`/ventas/api/buscar-clientes?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            if (response.ok) {
                const clientes = await response.json();
                setClientesFiltrados(clientes);
            }
        } catch (error) {
            console.error('Error al buscar clientes:', error);
        } finally {
            setBuscando(false);
        }
    }, 300);

    // useEffect para búsqueda en tiempo real
    useEffect(() => {
        buscarClientes(busquedaNombre, busquedaApellido, busquedaCedula);
    }, [busquedaNombre, busquedaApellido, busquedaCedula]);

    const handleClienteCreado = (nuevoCliente: Cliente) => {
        // Agregar el nuevo cliente a la lista
        const clientesActualizados = [...clientes, nuevoCliente];
        // Seleccionar automáticamente el nuevo cliente
        onClienteChange(nuevoCliente.id.toString());
        
        // Limpiar búsquedas
        setBusquedaNombre('');
        setBusquedaApellido('');
        setBusquedaCedula('');
        setClientesFiltrados([]);
    };

    const limpiarBusqueda = () => {
        setBusquedaNombre('');
        setBusquedaApellido('');
        setBusquedaCedula('');
        setClientesFiltrados([]);
    };

    const mostrarResultados = busquedaNombre || busquedaApellido || busquedaCedula;
    const clientesAMostrar = mostrarResultados ? clientesFiltrados : clientes;

    return (
        <div className="space-y-2">
            <Label htmlFor="id_cliente">Cliente *</Label>
            
            {/* Campos de búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <div className="relative">
                    <Input
                        placeholder="Buscar por nombre..."
                        value={busquedaNombre}
                        onChange={(e) => setBusquedaNombre(e.target.value)}
                        className={error ? 'border-red-500' : ''}
                    />
                    {busquedaNombre && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBusquedaNombre('')}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <Search className="w-3 h-3" />
                        </Button>
                    )}
                </div>
                
                <div className="relative">
                    <Input
                        placeholder="Buscar por apellido..."
                        value={busquedaApellido}
                        onChange={(e) => setBusquedaApellido(e.target.value)}
                        className={error ? 'border-red-500' : ''}
                    />
                    {busquedaApellido && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBusquedaApellido('')}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <Search className="w-3 h-3" />
                        </Button>
                    )}
                </div>
                
                <div className="relative">
                    <Input
                        placeholder="Buscar por cédula/RIF..."
                        value={busquedaCedula}
                        onChange={(e) => setBusquedaCedula(e.target.value)}
                        className={error ? 'border-red-500' : ''}
                    />
                    {busquedaCedula && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setBusquedaCedula('')}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <Search className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 mb-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={limpiarBusqueda}
                >
                    Limpiar Búsqueda
                </Button>
                <Button
                    type="button"
                    size="sm"
                    onClick={() => setModalAbierto(true)}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear Nuevo Cliente
                </Button>
            </div>

            {/* Indicador de búsqueda */}
            {buscando && (
                <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">Buscando clientes...</p>
                </div>
            )}

            {/* Select de clientes */}
            <Select
                value={selectedCliente}
                onValueChange={onClienteChange}
            >
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione un cliente" />
                </SelectTrigger>
                <SelectContent>
                    {clientesAMostrar.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.name} {cliente.apellido} - {cliente.cedula_rif}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Modal para crear cliente */}
            <CrearClienteModal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onClienteCreado={handleClienteCreado}
            />
        </div>
    );
}
