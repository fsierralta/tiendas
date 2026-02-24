// resources/js/Pages/Error.tsx
import React from 'react';
import { Head,Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import pageError from '@/pages/error/pageError';
//import { PageProps } from '@/types';

// resources/js/types/index.d.ts (o donde manejes tus tipos)

export interface User {
    id: number;
    name: string;
    email: string;
    // ... otros campos
}

export interface AuthProps {
    user: User | null;
    permissions: string[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: AuthProps;
    status?: number;
    message?: string;
    [key: string]: any;
};
interface Props {
    status: number;
    message?: string;
    auth: AuthProps;
    [key: string]: any;
}

export default function Error({ status, message, auth }: PageProps<Props>) {
    const title: Record<number, string> = {
        503: '503: Servicio No Disponible',
        500: '500: Error del Servidor',
        404: '404: Página No Encontrada',
        403: '403: Acceso Restringido',
    };

    const description: Record<number, string> = {
        503: 'Lo sentimos, estamos realizando tareas de mantenimiento.',
        500: 'Vaya, algo salió mal en nuestros servidores.',
        404: 'La página que buscas no existe.',
        403: 'No tienes los permisos necesarios para realizar esta acción.',
    };

    // Decidimos el Layout basado en si el usuario está logueado
    const Layout = auth.user ? AuthenticatedLayout : pageError;

    return (
        <Layout>
            <Head title={title[status] || 'Error'} />
            
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="max-w-md text-center">
                    <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">
                        {status}
                    </h1>

                    <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mt-4">
                        {title[status] || 'Error Inesperado'}
                    </p>

                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                        {message || description[status] || 'Ha ocurrido un error desconocido.'}
                    </p>

                    <Link
                        href='/logout'
                        method="post"
                       className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
                    >
                        Volver Atrás
                    </Link>
                </div>
            </div>
        </Layout>
    );
}