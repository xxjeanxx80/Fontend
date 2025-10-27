import { FormEvent, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminManagementTabs from '../components/AdminManagementTabs';
import AdminModal from '../components/AdminModal';
import AdminTable, { AdminTableColumn } from '../components/AdminTable';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  useCoupons,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} from '@/api/hooks/useCoupons';
import type { Coupon } from '@/api/types';

interface CouponFormState {
  code: string;
  discountPercent: number;
  maxRedemptions?: number;
  expiresAt: string;
  isActive: boolean;
}

const defaultFormState: CouponFormState = {
  code: '',
  discountPercent: 10,
  maxRedemptions: undefined,
  expiresAt: '',
  isActive: true,
};

const toDateInputValue = (value?: string) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const AdminCouponsPage = () => {
  const canRender = useProtectedRoute('/login', ['ADMIN']);
  const couponsQuery = useCoupons();
  const createMutation = useCreateCouponMutation();
  const deleteMutation = useDeleteCouponMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formState, setFormState] = useState<CouponFormState>(defaultFormState);

  const updateMutation = useUpdateCouponMutation(editingCoupon?.id ?? 0);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormState(defaultFormState);
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormState({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      maxRedemptions: coupon.maxRedemptions,
      expiresAt: toDateInputValue(coupon.expiresAt),
      isActive: coupon.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCoupon(null);
    setFormState(defaultFormState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      code: formState.code,
      discountPercent: Number(formState.discountPercent) || 0,
      maxRedemptions: formState.maxRedemptions ? Number(formState.maxRedemptions) : undefined,
      expiresAt: formState.expiresAt || undefined,
      isActive: formState.isActive,
    };

    if (editingCoupon) {
      updateMutation.mutate(payload, {
        onSuccess: closeModal,
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: closeModal,
      });
    }
  };

  const handleDelete = (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) {
      return;
    }
    deleteMutation.mutate(coupon.id);
  };

  const columns: AdminTableColumn<Coupon>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (coupon) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{coupon.code}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{coupon.discountPercent}% off</p>
        </div>
      ),
    },
    {
      key: 'maxRedemptions',
      header: 'Usage',
      render: (coupon) =>
        coupon.maxRedemptions ? `${coupon.redeemedCount ?? 0}/${coupon.maxRedemptions} redeemed` : 'Unlimited',
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (coupon) => (coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (coupon) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            coupon.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200'
          }`}
        >
          {coupon.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (coupon) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(coupon)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(coupon)}
            className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-200 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (!canRender) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <AdminLayout title="Coupons" subtitle="Manage coupon codes that guests can apply during checkout.">
      <div className="space-y-6">
        <AdminManagementTabs />
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Coupon codes</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Reward loyalty and drive conversions with tailored offers.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
          >
            New coupon
          </button>
        </div>
        <AdminTable
          data={couponsQuery.data}
          columns={columns}
          isLoading={couponsQuery.isLoading}
          emptyMessage="No coupons yet. Create one to delight your customers."
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCoupon ? 'Edit coupon' : 'Create coupon'}
        description="Set redemption limits, expiry, and activation status."
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="coupon-form"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingCoupon ? 'Save changes' : 'Create coupon'}
            </button>
          </>
        }
      >
        <form id="coupon-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Code</label>
            <input
              required
              value={formState.code}
              onChange={(event) => setFormState((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-wide text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Discount %</label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={formState.discountPercent}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, discountPercent: Number(event.target.value) || 0 }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Max redemptions</label>
              <input
                type="number"
                min={0}
                value={formState.maxRedemptions ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    maxRedemptions: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
                placeholder="Unlimited"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Expires on</label>
              <input
                type="date"
                value={formState.expiresAt}
                onChange={(event) => setFormState((prev) => ({ ...prev, expiresAt: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={formState.isActive ? 'active' : 'inactive'}
                onChange={(event) => setFormState((prev) => ({ ...prev, isActive: event.target.value === 'active' }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminCouponsPage;
