import CustomerLayout from '../customer/components/CustomerLayout';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { formatDateTime } from '@/api/utils';

const UsersListPage = () => {
  const canRender = useProtectedRoute();
  const usersQuery = useUsersQuery();
  const users = usersQuery.data ?? [];

  if (!canRender) {
    return null;
  }

  return (
    <CustomerLayout title="All users" subtitle="Administrative overview of registered accounts.">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600 dark:divide-slate-700 dark:text-slate-200">
              {usersQuery.isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{user.name ?? user.email}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.status ?? 'ACTIVE'}</td>
                    <td className="px-6 py-4">{formatDateTime(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default UsersListPage;
