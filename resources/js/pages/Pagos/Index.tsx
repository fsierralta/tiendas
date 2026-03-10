import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

// Importar componentes personalizados
import PagosFilters from '@/components/Pagos/Filters';
import PagosSummary from '@/components/Pagos/Summary';
import PagosTable from '@/components/Pagos/Table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pagos',
        href: "/pagos",
    },
];

interface Filters {
    fecha_inicio?: string;
    fecha_fin?: string;
    tipo?: string;
    responsable?: string;
}

interface Totales {
    total_pagado: string;
    total_promotores: string;
    total_tecnicos: string;
}

interface PaginatedData {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index() {
    const page = usePage().props as any;
    const pagos = page.pagos as PaginatedData;
    const filters = page.filters as Filters;
    const totales = page.totales as Totales;

    const [localFilters, setLocalFilters] = useState<Filters>({
        fecha_inicio: filters.fecha_inicio || '',
        fecha_fin: filters.fecha_fin || '',
        tipo: filters.tipo || '',
        responsable: filters.responsable || '',
    });

    const applyFilters = () => {
        router.get('/pagos', localFilters as any, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            fecha_inicio: '',
            fecha_fin: '',
            tipo: '',
            responsable: '',
        });
        router.get('/pagos', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const updateFilter = (key: keyof Filters, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handlePageChange = (page: number, currentFilters: any) => {
        router.get('/pagos', { ...currentFilters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Registro de Pagos</h1>
                        <p className="text-muted-foreground mt-2">
                            Historial de pagos realizados a Promotores y Técnicos.
                        </p>
                    </div>
                    <Link href="/pagos/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Registrar Nuevo Pago
                        </Button>
                    </Link>
                </div>

                {/* Componente de Filtros */}
                <PagosFilters
                    filters={localFilters}
                    onFilterChange={updateFilter}
                    onApplyFilters={applyFilters}
                    onClearFilters={clearFilters}
                />

                {/* Componente de Resumen */}
                <PagosSummary totales={totales} />

                {/* Componente de Tabla */}
                <PagosTable
                    pagos={pagos}
                    onPageChange={handlePageChange}
                    filters={localFilters}
                />
            </div>
        </AppLayout>
    );
}
