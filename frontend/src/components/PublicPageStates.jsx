export function PublicNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-6 text-center text-slate-950">
      <section className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Fuel My Chai
        </p>
        <h1 className="mt-3 text-3xl font-bold">This chai page doesn't exist</h1>
      </section>
    </main>
  );
}

export function PublicPageNotReady({ name }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-6 text-center text-slate-950">
      <section className="max-w-md">
        <DefaultAvatar name={name} />
        <h1 className="mt-5 text-3xl font-bold">
          This creator hasn't set up their chai page yet
        </h1>
      </section>
    </main>
  );
}

export function DefaultAvatar({ name }) {
  return (
    <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-800">
      {name?.charAt(0)?.toUpperCase() || 'C'}
    </div>
  );
}
