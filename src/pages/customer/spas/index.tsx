import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CustomerLayout from '../components/CustomerLayout';
import { useSpasQuery } from '@/api/hooks/useSpas';
import type { Spa } from '@/api/types';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const getDisplayAddress = (spa: Spa) => {
  if (spa.address) {
    return spa.address;
  }
  const parts = [spa.city, spa.state, spa.country].filter(Boolean);
  return parts.join(', ');
};

const CustomerSpaListPage = () => {
  const canRender = useProtectedRoute();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const filters = useMemo(
    () => ({
      search: search || undefined,
      location: location || undefined,
      category: category || undefined,
    }),
    [category, location, search],
  );

  const spasQuery = useSpasQuery(filters);
  const spas = spasQuery.data ?? [];

  const categories = useMemo(() => {
    const unique = new Set<string>();
    spas.forEach((spa) => spa.categories?.forEach((cat) => unique.add(cat)));
    return Array.from(unique);
  }, [spas]);

  const filteredSpas = useMemo(() => {
    return spas.filter((spa) => {
      const matchesSearch = search
        ? spa.name.toLowerCase().includes(search.toLowerCase()) ||
          (spa.description ?? '').toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesLocation = location
        ? getDisplayAddress(spa).toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesCategory = category ? spa.categories?.includes(category) : true;
      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [category, location, search, spas]);

  if (!canRender) {
    return null;
  }

  return (
    <CustomerLayout
      title="Find the perfect spa for any moment"
      subtitle="Filter by location, category, and ratings to uncover hand-picked beauty destinations."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={(event) => event.preventDefault()}>
          <div className="md:col-span-2">
            <label htmlFor="search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search spa name or treatment"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="City, district, or address"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </label>
            <select
              id="category"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <div className="mt-8">
        {spasQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : filteredSpas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-navy-900">
            No spas found. Try adjusting your filters or explore trending destinations on the home page.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpas.map((spa) => (
              <article
                key={spa.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-navy-900"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={spa.heroImageUrl ?? '/demo/customer/spa-card.png'}
                    alt={spa.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {spa.rating && (
                    <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                      ⭐ {spa.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{spa.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                      {spa.shortDescription ?? spa.description ?? 'Premium wellness treatments curated for you.'}
                    </p>
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {getDisplayAddress(spa) || 'Location coming soon'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {spa.categories?.slice(0, 3).map((cat) => (
                      <span
                        key={`${spa.id}-${cat}`}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <Link
                      href={`/customer/spas/${spa.id}`}
                      className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
                    >
                      View details
                    </Link>
                    <Link
                      href={{ pathname: '/customer/bookings/create', query: { spaId: spa.id } }}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Book now →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerSpaListPage;
