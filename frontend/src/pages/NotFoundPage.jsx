import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-6 text-center text-slate-950">
      <section className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Fuel My Chai
        </p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <Link
          className="mt-6 inline-flex rounded-md bg-amber-700 px-4 py-2 font-semibold text-white transition hover:bg-amber-800"
          to="/"
        >
          Go home
        </Link>
      </section>
    </main>
  );
}
