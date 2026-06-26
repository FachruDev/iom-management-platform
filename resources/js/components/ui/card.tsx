import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section className={cn('rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]', className)}>
            {children}
        </section>
    );
}

const colorMap: Record<string, { bg: string; badge: string; text: string }> = {
    primary: { bg: 'bg-primary/5', badge: 'bg-primary/10', text: 'text-primary' },
    purple: { bg: 'bg-purple-50/60', badge: 'bg-purple-200/60', text: 'text-purple-700' },
    red: { bg: 'bg-rose-50/60', badge: 'bg-rose-100/70', text: 'text-rose-700' },
    blue: { bg: 'bg-sky-50/60', badge: 'bg-sky-100/70', text: 'text-sky-700' },
    green: { bg: 'bg-emerald-50/60', badge: 'bg-emerald-100/70', text: 'text-emerald-700' },
};

export function StatPanel({ title, value, label, icon: Icon, color = 'primary' }: { 
    title: string; 
    value: string | number; 
    label?: string;
    icon: any;
    color?: 'primary' | 'purple' | 'red' | 'blue' | 'green'
}) {
    const theme = colorMap[color];

    return (
        <div className={cn('flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]', theme.bg)}>
            <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm/10 transition-transform duration-300', theme.badge, theme.text)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                    <span className="font-bold text-slate-700">{value}</span> {label || 'Item'}
                </p>
            </div>
        </div>
    );
}