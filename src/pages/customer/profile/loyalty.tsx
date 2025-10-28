import CustomerLayout from '../components/CustomerLayout';
import { useStoredUser } from '@/hooks/useStoredUser';
import { useLoyaltyPointsQuery, useLoyaltyRankQuery } from '@/api/hooks/useLoyalty';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { formatDateTime } from '@/api/utils';

const LoyaltyPage = () => {
  const canRender = useProtectedRoute();
  const user = useStoredUser();
  const pointsQuery = useLoyaltyPointsQuery(user?.id, {
    enabled: canRender && typeof user?.id === 'number',
  });
  const rankQuery = useLoyaltyRankQuery(user?.id, {
    enabled: canRender && typeof user?.id === 'number',
  });

  const points = pointsQuery.data?.points ?? 0;
  const history = pointsQuery.data?.history ?? [];
  const rank = rankQuery.data?.rank ?? 'Explorer';
  const tierName = rankQuery.data?.tierName ?? 'Silver';
  const nextTierPoints = rankQuery.data?.nextTierPoints;

  if (!canRender) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <CustomerLayout
      title="Loyalty & rewards"
      subtitle="Earn points for every booking and unlock spa perks, exclusive events, and VIP upgrades."
    >
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Current balance</p>
              <p className="mt-2 text-4xl font-bold text-primary">{points.toLocaleString()} pts</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Tier: <span className="font-semibold text-slate-900 dark:text-white">{tierName}</span> ({rank})
              </p>
            </div>
            {typeof nextTierPoints === 'number' && (
              <div className="rounded-2xl bg-primary/10 p-4 text-sm text-primary">
                {nextTierPoints <= 0
                  ? 'You unlocked our top tier!'
                  : `${nextTierPoints.toLocaleString()} pts left to reach the next tier.`}
              </div>
            )}
          </div>
        </section>
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How to earn faster</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>• Book weekday morning appointments for a +20% boost.</li>
            <li>• Share feedback after each visit to earn bonus points.</li>
            <li>• Refer friends to unlock instant loyalty upgrades.</li>
          </ul>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        {pointsQuery.isLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No loyalty activity yet. Book your first treatment to start collecting points.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{entry.reason ?? 'Spa reward'}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(entry.createdAt)}</p>
                </div>
                <span className="text-base font-semibold text-primary">+{entry.points}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </CustomerLayout>
  );
};

export default LoyaltyPage;
