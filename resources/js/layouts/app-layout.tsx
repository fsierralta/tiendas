import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import ToastProvider from '@/components/ToastProvider';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <ToastProvider>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </ToastProvider>
);
