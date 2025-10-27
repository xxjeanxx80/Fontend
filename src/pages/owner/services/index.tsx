import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../components/OwnerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useServicesQuery } from '@/api/hooks/useServices';
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from '@/api/hooks/useOwnerServices';
import type { Service } from '@/api/types';
import { formatCurrency } from '@/api/utils';
import { toast } from 'react-hot-toast';

const ServicesManagementPage = () => {
  const canRender = useProtectedRoute('/owner/login', ['OWNER']);
  const router = useRouter();
  const querySpaId = useMemo(() => {
    const value = router.query.spaId;
    if (Array.isArray(value)) {
      return Number.parseInt(value[0] ?? '', 10);
    }
    if (typeof value === 'string') {
      return Number.parseInt(value, 10);
    }
    return undefined;
  }, [router.query.spaId]);

  const [spaIdInput, setSpaIdInput] = useState(querySpaId?.toString() ?? '');
  const [spaId, setSpaId] = useState<number | undefined>(querySpaId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [serviceBeingEdited, setServiceBeingEdited] = useState<Service | null>(null);

  const servicesQuery = useServicesQuery(spaId ? { spaId } : undefined);
  const services = servicesQuery.data ?? [];

  const createServiceMutation = useCreateServiceMutation();
  const updateServiceMutation = useUpdateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

  const handleSelectSpa = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedId = Number.parseInt(spaIdInput, 10);
    if (!Number.isNaN(parsedId)) {
      setSpaId(parsedId);
      router.replace({ pathname: router.pathname, query: parsedId ? { spaId: parsedId } : undefined }, undefined, {
        shallow: true,
      });
    }
  };

  const handleCreateService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!spaId) {
      toast.error('Select a spa first');
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      price: Number.parseFloat(String(formData.get('price') ?? '0')),
      durationMinutes: Number.parseInt(String(formData.get('durationMinutes') ?? '0'), 10),
      serviceType: (formData.get('serviceType') as 'AT_SPA' | 'AT_HOME') ?? 'AT_SPA',
      availableAtHome: Boolean(formData.get('availableAtHome')),
      spaId,
    };
    createServiceMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        event.currentTarget.reset();
      },
    });
  };

  const handleUpdateService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!serviceBeingEdited) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      price: Number.parseFloat(String(formData.get('price') ?? '0')),
      durationMinutes: Number.parseInt(String(formData.get('durationMinutes') ?? '0'), 10),
      serviceType: (formData.get('serviceType') as 'AT_SPA' | 'AT_HOME') ?? 'AT_SPA',
      availableAtHome: Boolean(formData.get('availableAtHome')),
      spaId: serviceBeingEdited.spaId ?? spaId,
    };
    updateServiceMutation.mutate(
      {
        serviceId: serviceBeingEdited.id,
        data: payload,
      },
      {
        onSuccess: () => {
          setServiceBeingEdited(null);
        },
      },
    );
  };

  const handleDeleteService = (service: Service) => {
    setServiceBeingEdited(service);
    deleteServiceMutation.mutate(service.id, {
      onSuccess: () => {
        setServiceBeingEdited(null);
      },
    });
  };

  if (!canRender) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <OwnerLayout
      title="Services"
      subtitle="Curate your treatment list, update pricing, and publish new experiences."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSelectSpa}>
          <div className="flex-1">
            <label htmlFor="spaId" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Spa ID
            </label>
            <input
              id="spaId"
              name="spaId"
              type="number"
              value={spaIdInput}
              onChange={(event) => setSpaIdInput(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring focus:ring-primary/40"
            disabled={!spaId}
          >
            New service
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-navy-900/60">
              <tr>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600 dark:divide-slate-700 dark:text-slate-200">
              {servicesQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm">
                    Loading services…
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm">
                    {spaId ? 'No services yet. Start by adding your first treatment.' : 'Select a spa to view services.'}
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{service.name}</div>
                      <div className="text-xs text-slate-500">{service.description ?? 'No description provided.'}</div>
                    </td>
                    <td className="px-6 py-4">{service.durationMinutes ?? 0} mins</td>
                    <td className="px-6 py-4">{formatCurrency(service.price ?? 0)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {service.serviceType ?? 'AT_SPA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          className="text-xs font-semibold text-primary hover:underline"
                          onClick={() => {
                            setServiceBeingEdited(service);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold text-rose-500 hover:underline"
                          onClick={() => handleDeleteService(service)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-navy-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create service</h2>
              <button type="button" onClick={() => setIsCreateOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreateService}>
              <div>
                <label htmlFor="create-name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Name
                </label>
                <input
                  id="create-name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div>
                <label htmlFor="create-description" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  id="create-description"
                  name="description"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="create-price" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Price
                  </label>
                  <input
                    id="create-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label htmlFor="create-duration" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Duration (minutes)
                  </label>
                  <input
                    id="create-duration"
                    name="durationMinutes"
                    type="number"
                    min="0"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="create-type" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Service type
                  </label>
                  <select
                    id="create-type"
                    name="serviceType"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                    defaultValue="AT_SPA"
                  >
                    <option value="AT_SPA">At spa</option>
                    <option value="AT_HOME">At home</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <input type="checkbox" name="availableAtHome" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  Available for home visits
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-200/60 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                  disabled={createServiceMutation.isLoading}
                >
                  {createServiceMutation.isLoading ? 'Saving…' : 'Create service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {serviceBeingEdited && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-navy-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit service</h2>
              <button type="button" onClick={() => setServiceBeingEdited(null)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleUpdateService}>
              <div>
                <label htmlFor="edit-name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  defaultValue={serviceBeingEdited.name}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={serviceBeingEdited.description ?? ''}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-price" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Price
                  </label>
                  <input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={serviceBeingEdited.price ?? 0}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label htmlFor="edit-duration" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Duration (minutes)
                  </label>
                  <input
                    id="edit-duration"
                    name="durationMinutes"
                    type="number"
                    min="0"
                    defaultValue={serviceBeingEdited.durationMinutes ?? 0}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-type" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Service type
                  </label>
                  <select
                    id="edit-type"
                    name="serviceType"
                    defaultValue={serviceBeingEdited.serviceType ?? 'AT_SPA'}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  >
                    <option value="AT_SPA">At spa</option>
                    <option value="AT_HOME">At home</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="availableAtHome"
                    defaultChecked={Boolean(serviceBeingEdited.availableAtHome)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  Available for home visits
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setServiceBeingEdited(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-200/60 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                  disabled={updateServiceMutation.isLoading}
                >
                  {updateServiceMutation.isLoading ? 'Saving…' : 'Save changes'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteService(serviceBeingEdited)}
                className="mt-4 w-full rounded-lg border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 focus:outline-none focus:ring focus:ring-rose-200/60 dark:border-rose-400 dark:text-rose-300"
                disabled={deleteServiceMutation.isLoading}
              >
                {deleteServiceMutation.isLoading ? 'Removing…' : 'Delete service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default ServicesManagementPage;
