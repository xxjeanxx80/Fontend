'use client';

const CustomerSpasPage = () => {
  const featuredSpas = [
    { name: 'Lotus Wellness & Spa', location: 'District 1, Ho Chi Minh City' },
    { name: 'Azure Retreat', location: 'Hanoi Old Quarter' },
    { name: 'Serenity at Home', location: 'Remote therapist visit' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Discover spas near you</h2>
      <p className="text-sm text-slate-500">
        Choose a featured spa below or search within the marketplace to schedule your next treatment.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {featuredSpas.map((spa) => (
          <article key={spa.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{spa.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{spa.location}</p>
            <p className="mt-3 text-sm text-slate-600">
              View available services, browse staff schedules, and reserve a time that works for you.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CustomerSpasPage;
