
export default function GlassCard({
  children,
  className = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/5
        backdrop-blur-md
        border border-white/10
        rounded-2xl
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:border-sky-400/40
        hover:shadow-sky-500/10
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  );
}
