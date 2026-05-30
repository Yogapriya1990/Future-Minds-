export function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/40" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-radial from-violet-200/30 via-purple-100/20 to-transparent blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-radial from-pink-200/25 via-rose-100/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-radial from-indigo-100/20 to-transparent blur-3xl animate-float" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #6d28d9 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
