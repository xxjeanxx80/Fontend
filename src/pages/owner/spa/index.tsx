import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../components/OwnerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  useCreateSpaMutation,
  useSpaProfileQuery,
  useUpdateSpaApprovalMutation,
  useUpdateSpaMutation,
} from '@/api/hooks/useSpaProfile';

const SpaManagementPage = () => {
  const canRender = useProtectedRoute('/customer/login');
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
  const [activeSpaId, setActiveSpaId] = useState<number | undefined>(querySpaId);

  const spaQuery = useSpaProfileQuery(activeSpaId);
  const spa = spaQuery.data;

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    address: '',
  });

  useEffect(() => {
    if (spa) {
      setEditForm({
        name: spa.name ?? '',
        description: spa.description ?? '',
        address: spa.address ?? '',
      });
    }
  }, [spa]);

  const createSpaMutation = useCreateSpaMutation();
  const updateSpaMutation = useUpdateSpaMutation(spa?.id ?? 0);
  const updateApprovalMutation = useUpdateSpaApprovalMutation(spa?.id ?? 0);

  const handleLookupSpa = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedId = Number.parseInt(spaIdInput, 10);
    if (!Number.isNaN(parsedId)) {
      setActiveSpaId(parsedId);
      router.replace({ pathname: router.pathname, query: parsedId ? { spaId: parsedId } : undefined }, undefined, {
        shallow: true,
      });
    }
  };

  const handleCreateSpa = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      address: String(formData.get('address') ?? ''),
    };
    createSpaMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.data?.id) {
          setActiveSpaId(response.data.id);
          setSpaIdInput(response.data.id.toString());
        }
      },
    });
  };

  const handleUpdateSpa = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!spa?.id) {
      return;
    }
    updateSpaMutation.mutate({
      name: editForm.name,
      description: editForm.description,
      address: editForm.address,
    });
  };

  const handleApprovalToggle = (isApproved: boolean) => {
    if (!spa?.id) {
      return;
    }
    updateApprovalMutation.mutate({ isApproved });
  };

  if (!canRender) {
    return null;
  }

  return (
    <OwnerLayout
      title="Spa profile"
      subtitle="Register your spa, keep details up to date, and monitor approval status."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Load existing spa</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Enter a spa identifier to load and edit its profile.
          </p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleLookupSpa}>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="spaId">
              Spa ID
            </label>
            <input
              id="spaId"
              name="spaId"
              type="number"
              value={spaIdInput}
              onChange={(event) => setSpaIdInput(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
              placeholder="e.g. 12"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
            >
              Load spa
            </button>
          </form>

          {spaQuery.isLoading && (
            <p className="mt-4 text-sm text-slate-500">Looking up spa details…</p>
          )}
          {spa && (
            <dl className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-200">
              <div className="flex justify-between">
                <dt className="font-medium">Name</dt>
                <dd>{spa.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Address</dt>
                <dd>{spa.address ?? 'Not provided'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Approval</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      spa.isApproved
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                    }`}
                  >
                    {spa.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Register a new spa</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Share core details so the marketplace team can review and approve your spa.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleCreateSpa}>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Spa name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                placeholder="Lavender Glow Spa"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                placeholder="Highlight what makes your spa special."
              />
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                placeholder="123 Serenity Lane"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
              disabled={createSpaMutation.isLoading}
            >
              {createSpaMutation.isLoading ? 'Submitting…' : 'Submit for review'}
            </button>
          </form>
        </div>
      </section>

      {spa && (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit spa details</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Keep your spa listing current and accurate.</p>
            <form className="mt-6 space-y-4" onSubmit={handleUpdateSpa}>
              <div>
                <label htmlFor="edit-name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Spa name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  placeholder="Lavender Glow Spa"
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  value={editForm.description}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div>
                <label htmlFor="edit-address" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Address
                </label>
                <input
                  id="edit-address"
                  type="text"
                  value={editForm.address}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                disabled={updateSpaMutation.isLoading}
              >
                {updateSpaMutation.isLoading ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Approval status</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Update approval when you receive confirmation from the marketplace team.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleApprovalToggle(true)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold shadow focus:outline-none focus:ring focus:ring-emerald-400/40 ${
                  spa.isApproved
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
                disabled={updateApprovalMutation.isLoading && updateApprovalMutation.variables?.isApproved === true}
              >
                Mark as approved
              </button>
              <button
                type="button"
                onClick={() => handleApprovalToggle(false)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold shadow focus:outline-none focus:ring focus:ring-amber-400/40 ${
                  !spa.isApproved
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
                disabled={updateApprovalMutation.isLoading && updateApprovalMutation.variables?.isApproved === false}
              >
                Mark as pending
              </button>
            </div>
          </div>
        </section>
      )}
    </OwnerLayout>
  );
};

export default SpaManagementPage;
