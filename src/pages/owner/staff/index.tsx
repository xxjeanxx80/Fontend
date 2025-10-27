import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../components/OwnerLayout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useStaffQuery } from '@/api/hooks/useStaff';
import {
  useAssignShiftMutation,
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useRequestTimeOffMutation,
  useUpdateStaffMutation,
} from '@/api/hooks/useOwnerStaff';
import type { Staff } from '@/api/types';
import { formatDateTime } from '@/api/utils';
import { toast } from 'react-hot-toast';

const StaffManagementPage = () => {
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
  const [spaId, setSpaId] = useState<number | undefined>(querySpaId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeStaff, setActiveStaff] = useState<Staff | null>(null);

  const staffQuery = useStaffQuery(spaId ? { spaId } : undefined);
  const staffMembers = staffQuery.data ?? [];

  const createStaffMutation = useCreateStaffMutation();
  const updateStaffMutation = useUpdateStaffMutation();
  const deleteStaffMutation = useDeleteStaffMutation();
  const assignShiftMutation = useAssignShiftMutation();
  const requestTimeOffMutation = useRequestTimeOffMutation();

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

  const handleCreateStaff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!spaId) {
      toast.error('Select a spa first');
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      skills: String(formData.get('skills') ?? '')
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      spaId,
    };
    createStaffMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        event.currentTarget.reset();
      },
    });
  };

  const handleUpdateStaff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeStaff) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      skills: String(formData.get('skills') ?? '')
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      spaId: activeStaff.spaId ?? spaId,
    };
    updateStaffMutation.mutate(
      { staffId: activeStaff.id, data: payload },
      {
        onSuccess: () => setActiveStaff(null),
      },
    );
  };

  const handleDeleteStaff = (staffMember: Staff) => {
    deleteStaffMutation.mutate(staffMember.id, {
      onSuccess: () => {
        if (activeStaff?.id === staffMember.id) {
          setActiveStaff(null);
        }
      },
    });
  };

  const handleAssignShift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeStaff) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload = {
      startTime: String(formData.get('startTime') ?? ''),
      endTime: String(formData.get('endTime') ?? ''),
    };
    assignShiftMutation.mutate(
      { staffId: activeStaff.id, data: payload },
      {
        onSuccess: () => event.currentTarget.reset(),
      },
    );
  };

  const handleRequestTimeOff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeStaff) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload = {
      startAt: String(formData.get('startAt') ?? ''),
      endAt: String(formData.get('endAt') ?? ''),
      reason: String(formData.get('reason') ?? ''),
    };
    requestTimeOffMutation.mutate(
      { staffId: activeStaff.id, data: payload },
      {
        onSuccess: () => event.currentTarget.reset(),
      },
    );
  };

  if (!canRender) {
    return null;
  }

  return (
    <OwnerLayout
      title="Staff"
      subtitle="Introduce your team, assign shifts, and manage availability with ease."
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
            Add staff
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-navy-900/60">
              <tr>
                <th className="px-6 py-4">Team member</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Skills</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600 dark:divide-slate-700 dark:text-slate-200">
              {staffQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm">
                    Loading team members…
                  </td>
                </tr>
              ) : staffMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm">
                    {spaId
                      ? 'No staff profiles yet. Invite your team to join the hub.'
                      : 'Select a spa to manage staff.'}
                  </td>
                </tr>
              ) : (
                staffMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                      <div className="text-xs text-slate-500">#{member.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{member.email ?? '—'}</div>
                      <div className="text-xs text-slate-500">{member.phone ?? 'No phone listed'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {member.skills && member.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <span
                              key={`${member.id}-${skill}`}
                              className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">No skills tagged</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{member.createdAt ? formatDateTime(member.createdAt) : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          className="text-xs font-semibold text-primary hover:underline"
                          onClick={() => setActiveStaff(member)}
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold text-rose-500 hover:underline"
                          onClick={() => handleDeleteStaff(member)}
                        >
                          Remove
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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add team member</h2>
              <button type="button" onClick={() => setIsCreateOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreateStaff}>
              <div>
                <label htmlFor="create-name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Full name
                </label>
                <input
                  id="create-name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="create-email" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    id="create-email"
                    name="email"
                    type="email"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label htmlFor="create-phone" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Phone
                  </label>
                  <input
                    id="create-phone"
                    name="phone"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="create-skills" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Skills (comma separated)
                </label>
                <input
                  id="create-skills"
                  name="skills"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  placeholder="Massage, Facial therapy"
                />
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
                  disabled={createStaffMutation.isLoading}
                >
                  {createStaffMutation.isLoading ? 'Saving…' : 'Add team member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-navy-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Manage {activeStaff.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Update profile details, assign shifts, or log upcoming time off.
                </p>
              </div>
              <button type="button" onClick={() => setActiveStaff(null)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <form className="space-y-4" onSubmit={handleUpdateStaff}>
                <div>
                  <label htmlFor="edit-name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Full name
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    defaultValue={activeStaff.name}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-email" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      defaultValue={activeStaff.email ?? ''}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-phone" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Phone
                    </label>
                    <input
                      id="edit-phone"
                      name="phone"
                      defaultValue={activeStaff.phone ?? ''}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-skills" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Skills (comma separated)
                  </label>
                  <input
                    id="edit-skills"
                    name="skills"
                    defaultValue={activeStaff.skills?.join(', ') ?? ''}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStaff(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-200/60 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                    disabled={updateStaffMutation.isLoading}
                  >
                    {updateStaffMutation.isLoading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteStaff(activeStaff)}
                  className="w-full rounded-lg border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 focus:outline-none focus:ring focus:ring-rose-200/60 dark:border-rose-400 dark:text-rose-300"
                  disabled={deleteStaffMutation.isLoading}
                >
                  {deleteStaffMutation.isLoading ? 'Removing…' : 'Remove from spa'}
                </button>
              </form>

              <div className="space-y-6">
                <form className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700" onSubmit={handleAssignShift}>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assign shift</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Plan availability with start and end times.</p>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      Start
                      <input
                        type="datetime-local"
                        name="startTime"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      End
                      <input
                        type="datetime-local"
                        name="endTime"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
                    disabled={assignShiftMutation.isLoading}
                  >
                    {assignShiftMutation.isLoading ? 'Scheduling…' : 'Schedule shift'}
                  </button>
                </form>

                <form className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700" onSubmit={handleRequestTimeOff}>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Time-off request</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Log approved time away for accurate calendars.</p>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      Starts
                      <input
                        type="datetime-local"
                        name="startAt"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      Ends
                      <input
                        type="datetime-local"
                        name="endAt"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-300">
                      Reason
                      <input
                        type="text"
                        name="reason"
                        placeholder="Family event, training…"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/30 dark:border-slate-700 dark:bg-navy-800"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-600 focus:outline-none focus:ring focus:ring-amber-400/40"
                    disabled={requestTimeOffMutation.isLoading}
                  >
                    {requestTimeOffMutation.isLoading ? 'Submitting…' : 'Log time off'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default StaffManagementPage;
