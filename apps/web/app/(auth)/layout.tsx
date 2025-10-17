export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-tmIvory via-white to-tmBlush/40">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-32 h-96 w-96 rounded-full bg-tmBlush/40 blur-3xl" />
        <div className="absolute bottom-16 right-16 h-80 w-80 rounded-full bg-tmMauve/30 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-12 px-6 py-16">
        {children}
      </div>
    </div>
  );
}
