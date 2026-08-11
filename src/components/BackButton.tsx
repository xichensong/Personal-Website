export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm text-white/90 backdrop-blur-sm transition-colors hover:border-white/50 hover:text-white"
    >
      <span aria-hidden>←</span>
      Back
    </button>
  );
}
