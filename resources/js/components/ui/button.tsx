import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children: ReactNode;
};

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/10 active:scale-[0.98]',
        secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-100 active:scale-[0.98]',
        ghost: 'text-slate-600 hover:bg-slate-100/80 active:bg-slate-200/50',
    };

    return (
        <button
            className={cn(
                'inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 select-none',
                variants[variant],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
