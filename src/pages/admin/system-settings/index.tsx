import { FormEvent, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminManagementTabs from '../components/AdminManagementTabs';
import AdminModal from '../components/AdminModal';
import AdminTable, { AdminTableColumn } from '../components/AdminTable';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  useCreateSystemSettingMutation,
  useDeleteSystemSettingMutation,
  useSettings,
  useUpdateSystemSettingMutation,
} from '@/api/hooks/useSettings';
import type { SystemSetting } from '@/api/types';
import { formatDateTime } from '@/api/utils';

interface SettingFormState {
  key: string;
  value: string;
  description: string;
}

const defaultFormState: SettingFormState = {
  key: '',
  value: '',
  description: '',
};

const AdminSystemSettingsPage = () => {
  const canRender = useProtectedRoute('/login', ['ADMIN']);
  const settingsQuery = useSettings();
  const createMutation = useCreateSystemSettingMutation();
  const deleteMutation = useDeleteSystemSettingMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
  const [formState, setFormState] = useState<SettingFormState>(defaultFormState);

  const updateMutation = useUpdateSystemSettingMutation(editingSetting?.key ?? '');

  const openCreateModal = () => {
    setEditingSetting(null);
    setFormState(defaultFormState);
    setModalOpen(true);
  };

  const openEditModal = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setFormState({
      key: setting.key,
      value: setting.value,
      description: setting.description ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSetting(null);
    setFormState(defaultFormState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      key: formState.key,
      value: formState.value,
      description: formState.description || undefined,
    };

    if (editingSetting) {
      updateMutation.mutate(payload, {
        onSuccess: closeModal,
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: closeModal,
      });
    }
  };

  const handleDelete = (setting: SystemSetting) => {
    if (!window.confirm(`Delete setting ${setting.key}?`)) {
      return;
    }
    deleteMutation.mutate(setting.key);
  };

  const columns: AdminTableColumn<SystemSetting>[] = [
    {
      key: 'key',
      header: 'Key',
      render: (setting) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{setting.key}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{setting.description ?? '—'}</p>
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Value',
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (setting) => formatDateTime(setting.updatedAt ?? setting.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (setting) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(setting)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(setting)}
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
    <AdminLayout title="System settings" subtitle="Fine-tune global configuration for the Beauty Booking Hub platform.">
      <div className="space-y-6">
        <AdminManagementTabs />
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Configuration</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Manage feature flags, platform messages, and operational thresholds.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
          >
            New setting
          </button>
        </div>
        <AdminTable
          data={settingsQuery.data}
          columns={columns}
          isLoading={settingsQuery.isLoading}
          emptyMessage="No settings configured yet."
        />
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSetting ? 'Edit setting' : 'Create setting'}
        description="Update platform-wide configuration keys."
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
              form="system-setting-form"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingSetting ? 'Save changes' : 'Create setting'}
            </button>
          </>
        }
      >
        <form id="system-setting-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Key</label>
            <input
              required
              value={formState.key}
              onChange={(event) => setFormState((prev) => ({ ...prev, key: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-wide text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              disabled={Boolean(editingSetting)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Value</label>
            <textarea
              rows={3}
              required
              value={formState.value}
              onChange={(event) => setFormState((prev) => ({ ...prev, value: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <input
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100"
              placeholder="Optional context for admins"
            />
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminSystemSettingsPage;
