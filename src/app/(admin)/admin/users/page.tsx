'use client';

const adminUsers = [
  { email: 'hoa.nguyen@example.com', role: 'CUSTOMER' },
  { email: 'long.tran@example.com', role: 'OWNER' },
  { email: 'admin@beautyhub.io', role: 'ADMIN' },
];

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">User directory</h2>
      <table className="min-w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-left text-sm shadow-sm">
        <thead className="bg-slate-100 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map((user) => (
            <tr key={user.email} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">{user.email}</td>
              <td className="px-4 py-3 text-slate-500">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
