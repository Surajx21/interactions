"use client";

import { cn } from "@/lib/utils";
import {
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useScroll,
  useVelocity,
  useSpring,
  motion,
  type MotionValue,
} from "motion/react";
import { animate } from "motion";
import { useLenis } from "lenis/react";
import { Syne } from "next/font/google";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const IMAGES = [
  "https://assets.lummi.ai/assets/QmY6kSpVKzDqxuxL2Sk3HZ6i8sXdGGetSkHEhchhYgv64J?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmXayV8NzVqMsyrRNVwKLXYUQkdwYMYnU9beUx4ZwPE1XW?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmWxbL8DFqyCDVBnEmzM2WLmpSYYtNtPeaWE5W7XEhENnX?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmS88paxmh1UKirSAdwHmnpEmEuNQ72atZ7VobDSfGF1Gd?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmcoELVDuJSB9T6pCoDegq945cJLsyivZmAo34maycH3pT?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmdufQQozLxEFhRfiZ85RLepYKw5aYLdfXLwoF5YDwqni7?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmS1PY28ygkcj8yjALCdwc5PueV6AgWKve3ri6JATuqxrN?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmYoGx3koEL3xXc5fygZBXSi13rdb1k7KRRyMuoxtbENir?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmY35xeAvh96qAZXK5fotsGhH4PMScgvwURTJ12VsooLQ4?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmRiWNCWvKwVFbUYay86MTNgqxMmXkg51M9xPqY4eZW72p?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmPdVgMqNbmFPxxDWS8G9mGFCZtBvesjLScBuLShRhDPDi?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmVBXdTRqBpw219iL6fPw6A77UkC4qVU8o88Qc4QnwP8Ma?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmdzfyvUEAdxQPTZo2D5chr19fnY6MZQ8PSnpMFifnnaYD?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmS3hZtt6d5Vmv7rHSEK9uioPikp7v5VwUN85h26HFBzBX?auto=format&w=800",
  "https://assets.lummi.ai/assets/QmadaFbkLEnvtHoi54BByqLBynSYymk15qRzGcT4HJSSxQ?auto=format&w=800",
  "https://assets.lummi.ai/assets/Qmcj6e7HpPV8ckE7BcvSZUCTVbaEaHog1jCKL6dxMihUAY?auto=format&w=800",
] as const;

/* ─── Gallery configuration ─────────────────────────────────────────── */

const galleryConfig = {
  ovalWidthRatio: 0.32,
  ovalHeightRatio: 0.26,
  /** Degrees — tilts the whole ellipse */
  tiltAngle: -35,
  dimmedBrightness: 0.38,
  hoverScale: 1.08,
  /** Baseline cruising rotation speed in radians per second */
  rotationSpeed: 0.18,

  /* ── Ultra-smooth entrance choreography ───────────────────────────── */

  /** Brief clean mount window before animation unfolds */
  blankDuration: 0.15,
  /** Cascading drop duration from top of screen to center */
  dropDuration: 1.95,
  /** Distance above viewport from which cards fall */
  dropDistance: 0.75,
  /** Portion of timeline used for card-by-card cascade */
  dropStagger: 0.28,

  /** Spread begins BEFORE drop ends, eliminating any pause */
  spreadDelay: 0.62,
  /** Duration of outward fan into the ellipse */
  spreadDuration: 2,
  /** Portion of spread timeline for staggered blossom */
  spreadStagger: 0.3,

  /** Rotation acceleration starts during the spread so cards trace spiral arcs */
  rotationDelay: 0.68,
  /** Time taken to ramp up rotation speed to full cruising velocity */
  rotationRampDuration: 2.2,

  /* ── Infinite Scroll Configuration ────────────────────────────────── */
  scrollTrackHeight: 100000,
  initialScrollOffset: 50000,
  /** Sensitivity multiplier converting scroll px/s to angular velocity rad/s */
  scrollVelocitySensitivity: 0.0022,
  /** Maximum scroll-induced angular velocity */
  maxScrollAngularVelocity: 6.0,
} as const;

/* ─── Math helpers ──────────────────────────────────────────────────── */

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ─── Layout types & computation ────────────────────────────────────── */

interface ItemLayout {
  size: number;
  height: number;
  rotate: number;
}

function computeEllipseLayout(
  count: number,
  vw: number,
  vh: number,
  cfg: typeof galleryConfig,
): ItemLayout[] {
  const baseSize = Math.round(Math.min(vw, vh) * 0.3);
  const shrinkFactor = clamp(1 - (count - 8) * 0.03, 0.5, 1);
  const itemSize = Math.round(baseSize * shrinkFactor);
  const height = Math.round(itemSize * 0.75);

  const out: ItemLayout[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const rotate = cfg.tiltAngle * 0.6 + Math.cos(angle) * 8;
    out.push({ size: itemSize, height, rotate });
  }

  return out;
}

/* ─── GalleryItem (Memoized to prevent parent re-renders propagating) ─── */

interface GalleryItemProps {
  image: string;
  index: number;
  layout: ItemLayout;
  viewport: { w: number; h: number };
  rotation: MotionValue<number>;
  drop: MotionValue<number>;
  spread: MotionValue<number>;
  count: number;
  hoveredIndexMV: MotionValue<number>;
  isHovered: boolean;
  hasOtherHovered: boolean;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

const GalleryItem = React.memo(function GalleryItem({
  image,
  index,
  layout,
  viewport,
  rotation,
  drop,
  spread,
  count,
  hoveredIndexMV,
  isHovered,
  hasOtherHovered,
  onHoverStart,
  onHoverEnd,
}: GalleryItemProps) {
  const rx = viewport.w * galleryConfig.ovalWidthRatio;
  const ry = viewport.h * galleryConfig.ovalHeightRatio;
  const tiltRad = galleryConfig.tiltAngle * (Math.PI / 180);
  const baseAngle = (index / count) * Math.PI * 2 - Math.PI / 2 + tiltRad;

  // Staggered cascade so cards drop like a dealing deck rather than a single flat block
  const dropStagger = galleryConfig.dropStagger;
  const dropOffset = (index / count) * dropStagger;
  const itemDrop = useTransform(
    drop,
    [dropOffset, dropOffset + (1 - dropStagger)],
    [0, 1],
  );

  const dropDistance = viewport.h * galleryConfig.dropDistance;
  const dropY = useTransform(itemDrop, [0, 1], [-dropDistance, 0]);
  const opacity = useTransform(itemDrop, [0, 0.2], [0, 1]);
  const fallScale = useTransform(itemDrop, [0, 1], [0.65, 1]);

  // Staggered fan-out from center into orbital ellipse
  const spreadStagger = galleryConfig.spreadStagger;
  const spreadOffset = (index / count) * spreadStagger;
  const itemSpread = useTransform(
    spread,
    [spreadOffset, spreadOffset + (1 - spreadStagger)],
    [0, 1],
  );

  // Subtle fan angle at center before blossom into final 3D tilt
  const centerFanAngle = ((index - (count - 1) / 2) / count) * 14;

  // Swirling 2D coordinates: expands outward as rotation accelerates, tracing spiral arcs
  const x = useTransform(() => {
    const r = rotation.get();
    const s = itemSpread.get();
    const targetX = Math.cos(r + baseAngle) * rx;
    return targetX * s;
  });

  const y = useTransform(() => {
    const r = rotation.get();
    const s = itemSpread.get();
    const dy = dropY.get();
    const targetY = Math.sin(r + baseAngle) * ry;
    return targetY * s + dy;
  });

  // 3D depth along the tilted oval (0 = back, 1 = front)
  const depth = useTransform(() => {
    const r = rotation.get();
    return (Math.sin(r + baseAngle) + 1) / 2;
  });

  // Hardware-composited atmospheric depth: replaces expensive CSS filter:brightness
  // with a pure alpha compositing overlay (0% GPU shader cost, zero jank)
  const dimOpacity = useTransform(
    depth,
    [0, 1],
    [1 - galleryConfig.dimmedBrightness, 0],
  );

  // Z-index: front items occlude rear items; the hovered item jumps on top (z-index: 3000)
  const zIndex = useTransform(() => {
    if (hoveredIndexMV.get() === index) {
      return 3000;
    }
    return Math.round(depth.get() * 1000);
  });

  // Smooth rotation transition: center fan -> final orbit tilt
  const cardRotate = useTransform(() => {
    const s = itemSpread.get();
    return lerp(centerFanAngle, layout.rotate, s);
  });

  // Independent transform composition
  const imageTransform = useMotionTemplate`translate(${x}px, ${y}px) translate(-50%,-50%) rotate(${cardRotate}deg) scale(${fallScale})`;

  return (
    <motion.div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        zIndex,
        transform: imageTransform,
        opacity,
        pointerEvents: "auto",
      }}
    >
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-2xl shadow-2xl transition-[box-shadow,ring-color] duration-500 select-none cursor-pointer",
          isHovered
            ? "ring-2 ring-white/60 shadow-[0_30px_70px_rgba(0,0,0,0.9)]"
            : "ring-1 ring-white/10",
        )}
        whileHover={{
          scale: galleryConfig.hoverScale,
          transition: { type: "spring", stiffness: 350, damping: 25 },
        }}
        onHoverStart={() => onHoverStart(index)}
        onHoverEnd={onHoverEnd}
        style={{
          width: layout.size,
          height: layout.height,
        }}
      >
        <Image
          src={image}
          alt="Gallery image"
          width={layout.size}
          height={layout.height}
          priority={index < 4}
          sizes="(max-width: 768px) 50vw, 320px"
          className={cn(
            "h-full w-full object-cover object-top pointer-events-none transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hasOtherHovered && "grayscale brightness-75 contrast-95 opacity-40",
            isHovered && "grayscale-0 brightness-110 contrast-105 opacity-100",
            !isHovered && !hasOtherHovered && "grayscale-0 opacity-100",
          )}
        />
        {/* Hardware-accelerated depth dimming overlay: replaces GPU shader filters */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: isHovered ? 0 : dimOpacity }}
        />
        {/* Subtle cinematic vignette glow & backdrop dimming on other items */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none transition-opacity duration-500",
            hasOtherHovered && "opacity-80 bg-black/50",
            isHovered && "opacity-15",
          )}
        />
      </motion.div>
    </motion.div>
  );
});

let cachedViewport = { w: 1200, h: 800 };

function getViewportSnapshot() {
  if (
    typeof window !== "undefined" &&
    (window.innerWidth !== cachedViewport.w || window.innerHeight !== cachedViewport.h)
  ) {
    cachedViewport = { w: window.innerWidth, h: window.innerHeight };
  }
  return cachedViewport;
}

const serverViewportSnapshot = { w: 1200, h: 800 };
function getServerViewportSnapshot() {
  return serverViewportSnapshot;
}

function subscribeViewport(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function useViewport() {
  return useSyncExternalStore(
    subscribeViewport,
    getViewportSnapshot,
    getServerViewportSnapshot,
  );
}

/* ─── Page component ────────────────────────────────────────────────── */

export default function OrbitalGallery() {
  const viewport = useViewport();
  const lenis = useLenis();

  const layouts = useMemo(
    () =>
      computeEllipseLayout(
        IMAGES.length,
        viewport.w,
        viewport.h,
        galleryConfig,
      ),
    [viewport.w, viewport.h],
  );

  /* ── Hover tracking state ─────────────────────────────────────────── */
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const hoveredIndexMV = useMotionValue(-1);

  /* ── Direction memory: +1 = Clockwise, -1 = Anti-Clockwise ────────── */
  const directionRef = useRef<1 | -1>(1);

  /* ── Motion values ────────────────────────────────────────────────── */
  const rotation = useMotionValue(0);
  const rotationSpeed = useMotionValue(0);
  const drop = useMotionValue(0);
  const spread = useMotionValue(0);
  const entranceComplete = useRef(false);

  /* ── Motion Scroll & Velocity tracking ────────────────────────────── */
  const { scrollY } = useScroll();
  const motionScrollVelocity = useVelocity(scrollY);

  // Direct wheel velocity capture
  const manualVelocity = useMotionValue(0);
  const combinedVelocity = useMotionValue(0);

  // Physics-based smoothing with tuned damping to prevent oscillation
  const smoothVelocity = useSpring(combinedVelocity, {
    damping: 32,
    stiffness: 240,
    mass: 0.25,
  });

  /* ── Initialize scroll position halfway through the 100,000px track ── */
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(galleryConfig.initialScrollOffset, { immediate: true });
    } else if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo({
        top: galleryConfig.initialScrollOffset,
        behavior: "instant",
      });
    }

    const handleWheel = (e: WheelEvent) => {
      manualVelocity.set(e.deltaY * 5);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    let isResetting = false;
    const handleScroll = () => {
      if (isResetting) return;
      const y = window.scrollY;
      if (y < 2500 || y > galleryConfig.scrollTrackHeight - 5000) {
        isResetting = true;
        if (lenis) {
          lenis.scrollTo(galleryConfig.initialScrollOffset, { immediate: true });
        } else {
          window.scrollTo({
            top: galleryConfig.initialScrollOffset,
            behavior: "instant",
          });
        }
        setTimeout(() => {
          isResetting = false;
        }, 80);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lenis, manualVelocity]);

  /* ── Continuous 60/120fps rotation driven by frame delta & scroll velocity ── */
  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 64) / 1000;

    const mv = motionScrollVelocity.get();
    const wv = manualVelocity.get();

    // Only update and decay manual velocity when it actually has magnitude
    if (Math.abs(wv) > 0.05) {
      manualVelocity.set(wv * 0.90);
    } else if (wv !== 0) {
      manualVelocity.set(0);
    }

    const cleanMV = Math.abs(mv) < 12000 ? mv : 0;
    const activeVel = Math.abs(cleanMV) > Math.abs(wv) ? cleanMV : wv;

    // Only update combinedVelocity when it actually changes (avoids waking spring when idle)
    if (Math.abs(combinedVelocity.get() - activeVel) > 0.1) {
      combinedVelocity.set(activeVel);
    }

    const currentVelocity = smoothVelocity.get();

    // Dynamically update rotation direction based on active scroll direction:
    if (currentVelocity > 15) {
      directionRef.current = 1;
    } else if (currentVelocity < -15) {
      directionRef.current = -1;
    }

    const clampedVelocity = clamp(currentVelocity, -4000, 4000);
    const scrollAngularVelocity = clamp(
      clampedVelocity * galleryConfig.scrollVelocitySensitivity,
      -galleryConfig.maxScrollAngularVelocity,
      galleryConfig.maxScrollAngularVelocity,
    );

    const idleSpeed = directionRef.current * rotationSpeed.get();

    const totalSpeed = entranceComplete.current
      ? idleSpeed + scrollAngularVelocity
      : idleSpeed;

    if (Math.abs(totalSpeed) > 0.0001) {
      rotation.set(rotation.get() + totalSpeed * dt);
    }
  });

  /* ── Seamless Entrance Choreography (No Pauses, No Linear Steps) ─── */
  useEffect(() => {
    let cancelled = false;
    const controls: Array<{ stop: () => void }> = [];

    const fluidEase = [0.16, 1, 0.3, 1] as const;

    controls.push(
      animate(drop, 1, {
        duration: galleryConfig.dropDuration,
        ease: fluidEase,
        delay: galleryConfig.blankDuration,
      }),
    );

    controls.push(
      animate(spread, 1, {
        duration: galleryConfig.spreadDuration,
        ease: fluidEase,
        delay: galleryConfig.blankDuration + galleryConfig.spreadDelay,
        onComplete: () => {
          if (!cancelled) {
            entranceComplete.current = true;
          }
        },
      }),
    );

    controls.push(
      animate(rotationSpeed, galleryConfig.rotationSpeed, {
        duration: galleryConfig.rotationRampDuration,
        ease: fluidEase,
        delay: galleryConfig.blankDuration + galleryConfig.rotationDelay,
      }),
    );

    return () => {
      cancelled = true;
      controls.forEach((c) => c.stop());
    };
  }, [drop, spread, rotationSpeed]);

  /* ── Interactive hover: elevates z-index, greyscales others & slows rotation ── */
  const handleHoverStart = useCallback(
    (index: number) => {
      hoveredIndexMV.set(index);
      setActiveHoverIndex(index);

      if (entranceComplete.current) {
        animate(rotationSpeed, 0.04, {
          type: "spring",
          stiffness: 120,
          damping: 20,
        });
      }
    },
    [hoveredIndexMV, rotationSpeed],
  );

  const handleHoverEnd = useCallback(() => {
    hoveredIndexMV.set(-1);
    setActiveHoverIndex(null);

    if (entranceComplete.current) {
      animate(rotationSpeed, galleryConfig.rotationSpeed, {
        type: "spring",
        stiffness: 120,
        damping: 20,
      });
    }
  }, [hoveredIndexMV, rotationSpeed]);

  /* ── Centerpiece title motion transforms (revealed as cards blossom) ── */
  const centerTextOpacity = useTransform(spread, [0.25, 0.85], [0, 1]);
  const centerTextScale = useTransform(spread, [0.25, 1], [0.86, 1]);

  return (
    <div
      className="relative w-full bg-black select-none"
      style={{ height: `${galleryConfig.scrollTrackHeight}px` }}
    >
      {/* Fixed viewport containing the 3D gallery */}
      <main
        className={cn(
          "fixed inset-0 h-screen w-screen overflow-hidden pointer-events-none z-10",
          syne.className,
        )}
        aria-label="Orbital gallery"
        suppressHydrationWarning
      >
        {/* Center title in 3D depth space (z-index 500 floats inside the carousel ring) */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-center whitespace-nowrap"
          style={{
            zIndex: 500,
            opacity: centerTextOpacity,
            scale: centerTextScale,
          }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            MAYBESURAJ
          </h1>
        </motion.div>

        {IMAGES.map((image, i) => {
          const isHovered = activeHoverIndex === i;
          const hasOtherHovered = activeHoverIndex !== null && !isHovered;

          return (
            <GalleryItem
              key={image}
              image={image}
              index={i}
              layout={layouts[i]}
              viewport={viewport}
              rotation={rotation}
              drop={drop}
              spread={spread}
              count={IMAGES.length}
              hoveredIndexMV={hoveredIndexMV}
              isHovered={isHovered}
              hasOtherHovered={hasOtherHovered}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          );
        })}

        {/* Ambient indicator pill */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] text-white/50 tracking-[0.2em] uppercase font-semibold">
          <span>Scroll</span>
        </div>
      </main>
    </div>
  );
}
