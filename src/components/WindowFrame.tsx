import { forwardRef, ReactNode } from "react";

type Props = {
  preview: ReactNode;
  onClick: () => void;
};

const WindowFrame = forwardRef<HTMLDivElement, Props>(function WindowFrame(
  { preview, onClick },
  ref
) {
  return (
    <button
      onClick={onClick}
      className="group cursor-pointer bg-transparent p-1 transition-transform duration-300 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <div
        ref={ref}
        className="relative h-56 w-64 overflow-hidden border-[6px] border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-colors duration-300 group-hover:border-white/50 sm:h-64 sm:w-72"
      >
        {preview}
      </div>
    </button>
  );
});

export default WindowFrame;
