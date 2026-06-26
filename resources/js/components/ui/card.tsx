import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return <section className={cn('rounded-lg border border-slate-200 bg-white p-5 shadow-sm', className)}>{children}</section>;
}

export function StatCard({ title, value, meta }: { title: string; value: string | number; meta?: string }) {
    return (
        <Card>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
            {meta ? <p className="mt-1 text-sm text-slate-500">{meta}</p> : null}
        </Card>
    );
}
