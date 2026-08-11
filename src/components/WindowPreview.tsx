// At rest, the two hands — each its own pre-cropped image, split right
// where they meet — sit joined together in the middle, with the label
// centered over them. Each hand slides apart off-screen left/right
// independently, controlled by its own `revealed` flag, so they don't
// have to move in lockstep. The label fades out once either has started
// moving.
type Props = {
  leftRevealed: boolean;
  rightRevealed: boolean;
};

const SLIDE_DURATION_MS = 900;
const SLIDE_EASING = "cubic-bezier(0.65,0,0.35,1)";

function HandsPlaceholder({
  leftRevealed,
  rightRevealed,
  bg,
  leftSrc,
  rightSrc,
  label,
  labelClassName,
}: Props & {
  bg: string;
  leftSrc: string;
  rightSrc: string;
  label: string;
  labelClassName: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: bg }}>
      <div
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
        style={{
          transform: leftRevealed ? "translateX(-100%)" : "translateX(0)",
          transition: `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`,
        }}
      >
        <img src={leftSrc} alt="" className="h-full w-full object-contain object-right" />
      </div>
      <div
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
        style={{
          transform: rightRevealed ? "translateX(100%)" : "translateX(0)",
          transition: `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`,
        }}
      >
        <img src={rightSrc} alt="" className="h-full w-full object-contain object-left" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center pt-24"
        style={{
          opacity: leftRevealed || rightRevealed ? 0 : 1,
          transition: `opacity ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`,
        }}
      >
        <span className={`font-mono text-sm uppercase tracking-[0.3em] ${labelClassName}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

export function ProjectsPlaceholder({ leftRevealed, rightRevealed }: Props) {
  return (
    <HandsPlaceholder
      leftRevealed={leftRevealed}
      rightRevealed={rightRevealed}
      bg="#0e0e0e"
      leftSrc="/projects-left.jpg"
      rightSrc="/projects-right.jpg"
      label="Projects"
      labelClassName="text-white/70"
    />
  );
}

export function PublicationsPlaceholder({ leftRevealed, rightRevealed }: Props) {
  return (
    <HandsPlaceholder
      leftRevealed={leftRevealed}
      rightRevealed={rightRevealed}
      bg="#ffffff"
      leftSrc="/publications-left.jpg"
      rightSrc="/publications-right.jpg"
      label="Publications"
      labelClassName="text-black/60"
    />
  );
}
