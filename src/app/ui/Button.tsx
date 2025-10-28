'use client';

import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles =
    variant === 'secondary'
      ? 'bg-white text-blue-600 ring-1 ring-blue-100 hover:bg-blue-50 focus:ring-blue-200'
      : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400';

  return <button className={`${base} ${styles} ${className}`.trim()} {...props} />;
};

export default Button;
