import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section className={cn('rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm/60 transition-all duration-300 hover:shadow-md/40', className)}>
            {children}
        </section>
    );
}

export function StatCard({ title, value, icon: Icon, meta, variant = 'default' }: {
    title: string;
    value: string | number;
    icon?: any;
    meta?: string;
    variant?: 'default' | 'gradient'
}) {
    return (
        <Card className={cn(
            "relative overflow-hidden group border-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300",
            variant === 'gradient' && "bg-linear-to-br from-white via-slate-50/50 to-slate-100/50 border-slate-200"
        )}>
            {/* Decorative soft glow background on hover */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-400/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2.5">
                    <p className="text-xs font-bold tracking-wider uppercase text-slate-400/90">{title}</p>
                    <p className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        {value}
                    </p>
                </div>
                {Icon && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 shadow-sm/50 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-105 transition-all duration-300">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
            {meta ? (
                <div className="mt-4 pt-3 border-t border-slate-100/80 relative z-10">
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        {meta}
                    </p>
                </div>
            ) : null}
        </Card>
    );
}
