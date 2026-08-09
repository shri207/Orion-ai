import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    variant === 'primary' ? 'btn-primary'
    : variant === 'ghost'  ? 'btn-ghost'
    : 'bg-error/20 text-error border border-error/30 font-label text-xs uppercase tracking-widest py-3 px-6 rounded flex items-center justify-center gap-2 transition-all duration-300 hover:bg-error/30 active:scale-[0.97]';

  return (
    <button
      className={`${base} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          />
          Processing...
        </>
      ) : (
        <>
          {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
