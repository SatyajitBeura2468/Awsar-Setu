export default function Page() {
  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-white p-8 text-center shadow-soft">
      <h1 className="text-3xl font-black text-ink">You are offline</h1>
      <p className="mt-4 text-base leading-7 text-slate">
        Recently viewed and saved pages may still be available. Reconnect to
        refresh opportunities, official-source links and notifications.
      </p>
    </section>
  );
}
