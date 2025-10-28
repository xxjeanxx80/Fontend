'use client';

const OwnerStaffPage = () => {
  const staffMembers = [
    { name: 'Nguyen Thi Minh', role: 'Lead therapist' },
    { name: 'Tran Hoang Long', role: 'Massage specialist' },
    { name: 'Linh Pham', role: 'Front-desk coordinator' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Staff management</h2>
      <p className="text-sm text-slate-500">Assign shifts, approve time off, and keep your team in sync.</p>
      <div className="space-y-3">
        {staffMembers.map((member) => (
          <div key={member.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{member.name}</p>
              <p className="text-xs text-slate-500">{member.role}</p>
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-blue-500">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerStaffPage;
