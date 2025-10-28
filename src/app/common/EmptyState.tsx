'use client';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
  </div>
);

export default EmptyState;
