"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import React, { useEffect, useRef } from "react";

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // "setup" runs at the beginning of the frame loop, before Motion measures scroll coordinates
    function update({ timestamp }: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(timestamp);
    }

    frame.setup(update, true);

    return () => {
      cancelFrame(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.09,
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
