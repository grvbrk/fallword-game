'use client';

import { cn } from '../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export default function NeoButton({ className, children, onClick, ...props }: ButtonProps) {
  return (
    <button
      role="button"
      aria-label="Click to perform an action"
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-base border border-slate-900 bg-[#fc6] text-sm font-base transition-all dark:shadow-dark',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
