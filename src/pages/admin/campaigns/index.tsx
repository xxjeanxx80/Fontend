import { FormEvent, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminManagementTabs from '../components/AdminManagementTabs';
import AdminModal from '../components/AdminModal';
import AdminTable, { AdminTableColumn } from '../components/AdminTable';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  useCampaigns,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
  useUpdateCampaignMutation,
  useUpdateCampaignStatusMutation,
} from '@/api/hooks/useCampaigns';
import type { Campaign } from '@/api/types';

interface CampaignFormState {
  name: string;
  description: string;
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

const defaultFormState: CampaignFormState = {
  name: '',
  description: '',
  discountPercent: 10,
  startsAt: '',
  endsAt: '',
  isActive: true,
};

const toDateTimeInputValue = (value?: string) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
};

const AdminCampaignsPage = () => {
  const canRender = useProtectedRoute('/login', ['ADMIN']);
  const campaignsQuery = useCampaigns();
  const createMutation = useCreateCampaignMutation();
  const deleteMutation = useDeleteCampaignMutation();
  const statusMutation = useUpdateCampaignStatusMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formState, setFormState] = useState<CampaignFormState>(defaultFormState);

  const updateMutation = useUpdateCampaignMutation(editingCampaign?.id ?? 0);

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormState(defaultFormState);
    setModalOpen(true);
  };

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormState({
      name: campaign.name,
      description: campaign.description ?? '',
      discountPercent: campaign.discountPercent,
      startsAt: toDateTimeInputValue(campaign.startsAt),
      endsAt: toDateTimeInputValue(campaign.endsAt),
      isActive: campaign.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCampaign(null);
    setFormState(defaultFormState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: formState.name,
      description: formState.description || undefined,
      discountPercent: Number(formState.discountPercent) || 0,
      startsAt: formState.startsAt,
      endsAt: formState.endsAt || undefined,
      isActive: formState.isActive,
    };

    if (editingCampaign) {
      updateMutation.mutate(payload, {
        onSuccess: closeModal,
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: closeModal,
      });
    }
  };

  const handleDelete = (campaign: Campaign) => {
    if (!window.confirm(`Delete campaign “${campaign.name}”?`)) {
      return;
    }
    deleteMutation.mutate(campaign.id);
  };

  const columns: AdminTableColumn<Campaign>[] = [
    {
      key: 'name',
      header: 'Campaign',
      render: (campaign) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{campaign.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{campaign.description ?? '—'}</p>
        </div>
      ),
    },
    {
      key: 'discountPercent',
      header: 'Discount',
      render: (campaign) => `${campaign.discountPercent}%`,
    },
    {
      key: 'startsAt',
      header: 'Duration',
      render: (campaign) => (
        <div className="text-xs text-slate-500 dark:text-slate-300">
          <p>Starts: {campaign.startsAt ? new Date(campaign.startsAt).toLocaleString() : '—'}</p>
          <p>Ends: {campaign.endsAt ? new Date(campaign.endsAt).toLocaleString() : '—'}</p>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (campaign) => (
        <button
          type="button"
          onClick={() => statusMutation.mutate({ campaignId: campaign.id, data: { isActive: !campaign.isActive } })}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            campaign.isActive
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700/60 dark:text-slate-200'
          }`}
        >
          {campaign.isActive ? 'Active' : 'Paused'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (campaign) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(campaign)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(campaign)}
            className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-200 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (!canRender) {
    return null;
  }

  return (
    <AdminLayout
      title="Marketing campaigns"
      subtitle="Launch offers to drive bookings, loyalty, and marketplace engagement."
    >
      <div className="space-y-6">
        <AdminManagementTabs />
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Campaign library</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Keep seasonal promotions organised and pause or activate campaigns in a single click.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
          >
            New campaign
          </button>
        </div>
        <AdminTable
          data={campaignsQuery.data}
          columns={columns}
          isLoading={campaignsQuery.isLoading}
          emptyMessage="No campaigns yet. Create your first promotion."
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCampaign ? 'Edit campaign' : 'Create campaign'}
        description="Set discounts, schedule dates, and control visibility."
        size="lg"
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
              form="campaign-form"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingCampaign ? 'Save changes' : 'Create campaign'}
            </button>
          </>
        }
      >
        <form id="campaign-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign name</label>
            <input
              required
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <textarea
              rows={3}
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={formState.isActive ? 'active' : 'inactive'}
                onChange={(event) => setFormState((prev) => ({ ...prev, isActive: event.target.value === 'active' }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Paused</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Starts at</label>
              <input
                type="datetime-local"
                required
                value={formState.startsAt}
                onChange={(event) => setFormState((prev) => ({ ...prev, startsAt: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Ends at</label>
              <input
                type="datetime-local"
                value={formState.endsAt}
                onChange={(event) => setFormState((prev) => ({ ...prev, endsAt: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              />
            </div>
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminCampaignsPage;
