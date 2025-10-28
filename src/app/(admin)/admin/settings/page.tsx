'use client';

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Platform settings</h2>
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-700">Maintenance mode</p>
          <p className="text-xs text-slate-500">Plan downtime windows and communicate outages in advance.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">Security alerts</p>
          <p className="text-xs text-slate-500">Receive notifications for suspicious login activity or API abuse.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">Payout partners</p>
          <p className="text-xs text-slate-500">Manage connected banks and configure payout cadences for spa owners.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
