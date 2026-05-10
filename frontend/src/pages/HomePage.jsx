export default function HomePage() {
  function goToLogin() {
    window.location.href = '/login';
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-6 py-10 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Creator support
        </p>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Fuel My Chai
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            A lightweight UPI support page for Indian creators. Create a public
            page, share your link, and let supporters pay you directly.
          </p>
        </div>
        <button
          className="w-fit rounded-md bg-amber-700 px-5 py-3 font-semibold text-white transition hover:bg-amber-800"
          onClick={goToLogin}
          type="button"
        >
          Get started
        </button>
      </section>
    </main>
  );
}
