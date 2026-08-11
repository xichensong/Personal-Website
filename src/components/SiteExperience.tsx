"use client";

import { useEffect, useRef, useState } from "react";
import WindowFrame from "./WindowFrame";
import BackButton from "./BackButton";
import { ProjectsPlaceholder, PublicationsPlaceholder } from "./WindowPreview";
import {
  profile,
  featuredProjects,
  tradingProjects,
  clientProjects,
  publications,
  translatedBooks,
} from "@/data/resume";

type Page = "projects" | "publications";
type Rect = { top: number; left: number; width: number; height: number };
type SidebarLink = { label: string; href: string };
type SidebarEntry = { title: string; subtitle?: string; links: SidebarLink[] };
type CategoryGroup = { heading: string; items: SidebarEntry[] };

const DURATION = 900;
const EASING = "cubic-bezier(0.65,0,0.35,1)";
const SITE_URL = "https://personal-website-puce-ten-89.vercel.app/";
const CATEGORY_FADE_MS = 600;
const INTRO_FRAME_FADE_MS = 700;
const INTRO_FRAME_DELAY_MS = 150;
// Each window's hands join at their own random moment within this window,
// instead of both pairs snapping together in lockstep.
const INTRO_HANDS_MIN_DELAY_MS = INTRO_FRAME_DELAY_MS + INTRO_FRAME_FADE_MS + 100;
const INTRO_HANDS_MAX_DELAY_MS = INTRO_HANDS_MIN_DELAY_MS + 1200;

function randomHandsDelay() {
  return INTRO_HANDS_MIN_DELAY_MS + Math.random() * (INTRO_HANDS_MAX_DELAY_MS - INTRO_HANDS_MIN_DELAY_MS);
}

const PROJECT_CATEGORIES: CategoryGroup[] = [
  {
    heading: "Quantitative Research",
    items: tradingProjects.map((p) => ({ title: p.title, links: p.links })),
  },
  {
    heading: "IOS App",
    items: featuredProjects.map((p) => ({ title: p.title, links: p.links })),
  },
  {
    heading: "Website Designs",
    items: clientProjects.map((p) => ({ title: p.title, links: p.links })),
  },
];

const PUBLICATION_CATEGORIES: CategoryGroup[] = [
  {
    heading: "Research Papers",
    items: publications.map((p) => ({ title: p.title, links: p.links })),
  },
  {
    heading: "Translated Books",
    items: translatedBooks.map((b) => ({
      title: b.title,
      subtitle: b.author ?? b.note,
      links: [],
    })),
  },
];

function SidebarEntryView({
  entry,
  titleClassName,
  subtitleClassName,
  linkClassName,
}: {
  entry: SidebarEntry;
  titleClassName: string;
  subtitleClassName: string;
  linkClassName: string;
}) {
  if (entry.links.length === 1) {
    return (
      <a
        href={entry.links[0].href}
        target="_blank"
        rel="noreferrer"
        className={`${titleClassName} transition-[font-weight] hover:font-bold`}
      >
        {entry.title}
      </a>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className={titleClassName}>{entry.title}</span>
      {entry.subtitle && <span className={subtitleClassName}>{entry.subtitle}</span>}
      {entry.links.length > 1 && (
        <span className="flex gap-3">
          {entry.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`${linkClassName} transition-[font-weight] hover:font-bold`}
            >
              {link.label}
            </a>
          ))}
        </span>
      )}
    </div>
  );
}

// The least scale (from a given pixel origin) at which every edge of
// `rect` has moved past the corresponding viewport edge — the minimum
// zoom needed for the window to fully cover the screen. Overshooting
// this wastes transition time on a change that's already invisible.
function requiredScale(originX: number, originY: number, rect: Rect, vw: number, vh: number) {
  const left = rect.left;
  const right = rect.left + rect.width;
  const top = rect.top;
  const bottom = rect.top + rect.height;
  const candidates = [
    left < originX ? originX / (originX - left) : 1,
    right > originX ? (vw - originX) / (right - originX) : 1,
    top < originY ? originY / (originY - top) : 1,
    bottom > originY ? (vh - originY) / (bottom - originY) : 1,
  ];
  return Math.max(...candidates) * 1.1;
}

// Max distance (px) the background pans toward either edge, and how far
// past the container it's oversized so that pan never uncovers an edge.
const PARALLAX_SHIFT = 30;
const PARALLAX_OVERSIZE = 50;

export default function SiteExperience() {
  const [zoomed, setZoomed] = useState(false);
  const [page, setPage] = useState<Page | null>(null);
  const [originPx, setOriginPx] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const projectsFrameRef = useRef<HTMLDivElement>(null);
  const publicationsFrameRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [framesVisible, setFramesVisible] = useState(false);
  const [projectsLeftJoined, setProjectsLeftJoined] = useState(false);
  const [projectsRightJoined, setProjectsRightJoined] = useState(false);
  const [publicationsLeftJoined, setPublicationsLeftJoined] = useState(false);
  const [publicationsRightJoined, setPublicationsRightJoined] = useState(false);
  // Normalized -1..1 offset of the cursor from the wall's center.
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  function handleWallMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wallRef.current?.getBoundingClientRect();
    if (!rect) return;
    setParallax({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }

  function handleWallMouseLeave() {
    setParallax({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (!zoomed) {
      setCategoriesVisible(false);
      return;
    }
    const timer = setTimeout(() => setCategoriesVisible(true), DURATION);
    return () => clearTimeout(timer);
  }, [zoomed]);

  // Lock page scroll while a window is open — on mobile the wall can be
  // taller than the viewport, and scrolling mid-zoom would slide the
  // "fullscreen" illusion out from under the fixed-position chrome above it.
  useEffect(() => {
    document.body.style.overflow = zoomed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  // On first load: the windows fade in empty, then each of the four hands
  // (left/right, in each window) slides in on its own random schedule —
  // nothing snaps together in lockstep.
  useEffect(() => {
    const frameTimer = setTimeout(() => setFramesVisible(true), INTRO_FRAME_DELAY_MS);
    const timers = [
      setTimeout(() => setProjectsLeftJoined(true), randomHandsDelay()),
      setTimeout(() => setProjectsRightJoined(true), randomHandsDelay()),
      setTimeout(() => setPublicationsLeftJoined(true), randomHandsDelay()),
      setTimeout(() => setPublicationsRightJoined(true), randomHandsDelay()),
    ];
    return () => {
      clearTimeout(frameTimer);
      timers.forEach(clearTimeout);
    };
  }, []);

  // There's no separate "page" to reveal — the window on the wall already
  // shows the same placeholder its fullscreen state would. So the wall's
  // own window is what zooms; nothing else needs to grow in step with it,
  // which is what was letting the two drift out of sync and spill past
  // each other during the close animation.
  function openWindow(target: Page, ref: React.RefObject<HTMLDivElement | null>) {
    const r = ref.current?.getBoundingClientRect();
    const contentRect = contentRef.current?.getBoundingClientRect();
    if (!r || !contentRect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Viewport-space origin — what requiredScale needs, since it's reasoning
    // about covering the viewport.
    const originX = r.left + r.width / 2;
    const originY = r.top + r.height / 2;
    // CSS transform-origin is relative to the scaled element's OWN box, not
    // the viewport. Those only coincide when that box sits exactly at
    // viewport (0,0) — true on desktop (absolute inset-0), but not once the
    // content flows normally on mobile so the page can scroll. Convert.
    setOriginPx({ x: originX - contentRect.left, y: originY - contentRect.top });
    setScale(
      requiredScale(originX, originY, { top: r.top, left: r.left, width: r.width, height: r.height }, vw, vh)
    );
    setPage(target);
    setZoomed(true);
  }

  function closeWindow() {
    setZoomed(false);
  }

  return (
    <div
      ref={wallRef}
      onMouseMove={handleWallMouseMove}
      onMouseLeave={handleWallMouseLeave}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0d]"
    >
      {/* The cloud backdrop, on its own layer so it can pan independently
          of the click-to-open zoom below. Oversized on every edge and
          nudged opposite the cursor — like turning your head to look
          past the near edge of the frame — then eased back to center
          when the mouse leaves. */}
      <div
        aria-hidden
        style={{
          inset: `-${PARALLAX_OVERSIZE}px`,
          transform: `translate(${-parallax.x * PARALLAX_SHIFT}px, ${-parallax.y * PARALLAX_SHIFT}px)`,
          transition: "transform 400ms ease-out",
          backgroundImage:
            "linear-gradient(rgba(5, 6, 10, 0.55), rgba(5, 6, 10, 0.55)), url('/wall-clouds.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="pointer-events-none absolute"
      />

      {/* The wall — hero content + the two windows. Zooms in, centered on
          whichever window was clicked, until that window covers the whole
          screen; since the window shows the same placeholder its
          fullscreen state does, that's the entire "opening" a page. */}
      <div
        ref={contentRef}
        style={{
          transformOrigin: `${originPx.x}px ${originPx.y}px`,
          transform: zoomed ? `scale(${scale})` : "scale(1)",
          transition: `transform ${DURATION}ms ${EASING}`,
        }}
        className={`relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6 py-16 sm:absolute sm:inset-0 sm:min-h-0 sm:gap-14 ${
          zoomed ? "pointer-events-none" : ""
        }`}
      >
        <div className="relative text-center font-mono">
          <p className="mb-3 text-sm text-white/50">{profile.location}</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg text-white/70">{profile.tagline}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <a
              href={`mailto:${profile.email}`}
              className="text-white/70 transition-[font-weight] hover:font-bold"
            >
              Email
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 transition-[font-weight] hover:font-bold"
            >
              LinkedIn
            </a>
          </div>

          <div
            style={{ fontFamily: "monospace", fontSize: 12 }}
            className="mt-6 flex items-center justify-center gap-2 text-white/60"
          >
            <a
              href={`https://calwebring.com/prev?current=${SITE_URL}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              ←
            </a>
            <a href="https://calwebring.com" target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://calwebring.com/badge.png" width={36} alt="Cal Webring" />
            </a>
            <a
              href={`https://calwebring.com/next?current=${SITE_URL}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              →
            </a>
          </div>
        </div>

        <div
          style={{
            opacity: framesVisible ? 1 : 0,
            transition: `opacity ${INTRO_FRAME_FADE_MS}ms ease`,
          }}
          className="relative grid grid-cols-1 gap-10 sm:grid-cols-2"
        >
          <WindowFrame
            ref={projectsFrameRef}
            preview={
              <ProjectsPlaceholder
                leftRevealed={zoomed ? page === "projects" : !projectsLeftJoined}
                rightRevealed={zoomed ? page === "projects" : !projectsRightJoined}
              />
            }
            onClick={() => openWindow("projects", projectsFrameRef)}
          />
          <WindowFrame
            ref={publicationsFrameRef}
            preview={
              <PublicationsPlaceholder
                leftRevealed={zoomed ? page === "publications" : !publicationsLeftJoined}
                rightRevealed={zoomed ? page === "publications" : !publicationsRightJoined}
              />
            }
            onClick={() => openWindow("publications", publicationsFrameRef)}
          />
        </div>
      </div>

      {/* Sits outside the scaled wall (so it doesn't get zoomed too),
          fading in once fully zoomed in. */}
      <div
        style={{
          opacity: zoomed ? 1 : 0,
          pointerEvents: zoomed ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
        className="fixed left-6 top-6 z-30"
      >
        <BackButton onClick={closeWindow} />
      </div>

      {/* Category lists also sit outside the scaled wall — their own text
          size would otherwise be multiplied by whatever zoom factor that
          particular window needed, which blows up wildly for long labels.
          They fade in only once the hands have fully separated. */}
      <div
        style={{
          opacity: zoomed && page === "projects" && categoriesVisible ? 1 : 0,
          pointerEvents: zoomed && page === "projects" && categoriesVisible ? "auto" : "none",
          transition: `opacity ${CATEGORY_FADE_MS}ms ease`,
        }}
        className="fixed left-1/2 top-1/2 z-20 flex max-h-[80vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-row flex-wrap items-start justify-center gap-x-16 gap-y-10 overflow-y-auto"
      >
        {PROJECT_CATEGORIES.map((group) => (
          <div
            key={group.heading}
            className="flex w-56 flex-shrink-0 flex-col items-center gap-5 text-center sm:w-64 sm:gap-6"
          >
            <span className="font-mono text-base uppercase tracking-[0.25em] text-white/70 sm:text-lg">
              {group.heading}:
            </span>
            <div className="flex flex-col items-center gap-4 sm:gap-5">
              {group.items.map((item) => (
                <SidebarEntryView
                  key={item.title}
                  entry={item}
                  titleClassName="font-mono text-sm text-white/50 sm:text-base"
                  subtitleClassName="font-mono text-xs text-white/35 sm:text-sm"
                  linkClassName="font-mono text-xs text-white/50 sm:text-sm"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          opacity: zoomed && page === "publications" && categoriesVisible ? 1 : 0,
          pointerEvents: zoomed && page === "publications" && categoriesVisible ? "auto" : "none",
          transition: `opacity ${CATEGORY_FADE_MS}ms ease`,
        }}
        className="fixed left-1/2 top-1/2 z-20 flex max-h-[80vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-row flex-wrap items-start justify-center gap-x-16 gap-y-10 overflow-y-auto"
      >
        {PUBLICATION_CATEGORIES.map((group) => (
          <div
            key={group.heading}
            className="flex w-64 flex-shrink-0 flex-col items-center gap-5 text-center sm:w-72 sm:gap-6"
          >
            <span className="font-mono text-base uppercase tracking-[0.25em] text-black/65 sm:text-lg">
              {group.heading}:
            </span>
            <div className="flex flex-col items-center gap-4 sm:gap-5">
              {group.items.map((item) => (
                <SidebarEntryView
                  key={item.title}
                  entry={item}
                  titleClassName="font-mono text-sm text-black/50 sm:text-base"
                  subtitleClassName="font-mono text-xs text-black/35 sm:text-sm"
                  linkClassName="font-mono text-xs text-black/50 sm:text-sm"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
