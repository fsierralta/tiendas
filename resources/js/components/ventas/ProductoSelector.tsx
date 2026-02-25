import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Producto {
    id: number;
    name: string;
    precio: number | string;
    cantidad: number;
    categoria?: { name: string };
    ubicacion?: { name: string };
    marca?: string;
}

interface ProductoSelectorProps {
    productos: Producto[];
    onProductoAdd: (producto: Producto) => void;
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

export default function ProductoSelector({ productos, onProductoAdd }: ProductoSelectorProps) {
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [busquedaMarca, setBusquedaMarca] = useState('');
    const [buscando, setBuscando] = useState(false);

    // Función de búsqueda con debounce
    const buscarProductos = useDebounce(async (nombre: string, marca: string) => {
        if (!nombre.trim() && !marca.trim()) {
            setProductosFiltrados([]);
            return;
        }

        setBuscando(true);
        try {
            const response = await fetch(`/ventas/api/buscar-productos?nombre=${encodeURIComponent(nombre)}&marca=${encodeURIComponent(marca)}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            if (response.ok) {
                const productos = await response.json();
                setProductosFiltrados(productos);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
        } finally {
            setBuscando(false);
        }
    }, 300);

    // useEffect para búsqueda en tiempo real
    useEffect(() => {
        buscarProductos(busquedaNombre, busquedaMarca);
    }, [busquedaNombre, busquedaMarca]);

    const toNumber = (value: any): number => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const productosAMostrar = (busquedaNombre || busquedaMarca) 
        ? productosFiltrados 
        : productos.filter(p => p.cantidad > 0);

    return (
        <div className="space-y-4">
            {/* Campos de búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="busqueda_nombre">Buscar por Nombre</Label>
                    <Input
                        id="busqueda_nombre"
                        type="text"
                        value={busquedaNombre}
                        onChange={(e) => setBusquedaNombre(e.target.value)}
                        placeholder="Escriba el nombre del producto..."
                    />
                </div>
                <div>
                    <Label htmlFor="busqueda_marca">Buscar por Marca</Label>
                    <Input
                        id="busqueda_marca"
                        type="text"
                        value={busquedaMarca}
                        onChange={(e) => setBusquedaMarca(e.target.value)}
                        placeholder="Escriba la marca..."
                    />
                </div>
            </div>

            {/* Indicador de búsqueda */}
            {buscando && (
                <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">Buscando productos...</p>
                </div>
            )}

            {/* Lista de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-40 overflow-y-auto">
                {productosAMostrar.map(producto => (
                    <div key={producto.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">{producto.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {producto.categoria?.name} - Stock: {producto.cantidad}
                                </p>
                                <p className="text-sm font-semibold">${toNumber(producto.precio).toFixed(2)}</p>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => onProductoAdd(producto)}
                                className="ml-2"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
