import { ReactNode } from 'react';

type ModalSize = 'md' | 'lg';

interface AdminModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const sizeClassMap: Record<ModalSize, string> = {
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

const AdminModal = ({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
}: AdminModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-10">
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${sizeClassMap[size]} rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-navy-900`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 text-sm text-slate-600 dark:text-slate-200">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-navy-950">{footer}</div>}
      </div>
    </div>
  );
};

export default AdminModal;
