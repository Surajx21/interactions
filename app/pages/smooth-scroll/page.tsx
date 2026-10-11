"use client";

import {
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import { cards } from "./data";

const CARD_WIDTH = 200;
const CARD_GAP = 16;
const MIN_CURVE = 100;
const MAX_CURVE = 500;
const VELOCITY_THRESHOLD = 3000;

function Card({
  index,
  x,
  center,
  depth,
}: {
  index: number;
  x: MotionValue<number>;
  center: number;
  depth: MotionValue<number>;
}) {
  const normalizedPos = useTransform(x, (xPos) => {
    const cardCenter = xPos + index * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
    const maxDistance = center + CARD_WIDTH * 2;
    return Math.max(-1, Math.min((cardCenter - center) / maxDistance, 1));
  });

  const translateY = useTransform(
    [normalizedPos, depth],
    ([n, d]) => Math.pow(n as number, 2) * (d as number)
  );

  const bgPosition = useTransform(normalizedPos, (n) => `${60 + n * 30}%`);

  return (
    <motion.div
      className="h-110 shrink-0 bg-cover relative"
      style={{
        width: CARD_WIDTH,
        minWidth: CARD_WIDTH,
        translateY,
        backgroundImage: `url(${cards[index].image})`,
        backgroundPositionX: bgPosition,
        willChange: "transform, width",
      }}
    />
  );
}

export default function SmoothScroll() {
  const containerRef = useRef(null);
  const [center, setCenter] = useState(0);

  useEffect(() => {
    const update = () => setCenter(window.innerWidth / 2);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const velocity = useVelocity(scrollY);

  const velocityIntensityRaw = useTransform(velocity, (v) =>
    Math.min(Math.abs(v) / VELOCITY_THRESHOLD, 1)
  );

  const curveDepth = useTransform(
    velocityIntensityRaw,
    (normalized) => MIN_CURVE + normalized * (MAX_CURVE - MIN_CURVE)
  );

  const depth = useSpring(curveDepth, { damping: 20, stiffness: 80 });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [center, -(cards.length - 1) * (CARD_WIDTH + CARD_GAP) + center]
  );

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: `${cards.length * 30}vh` }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="flex absolute top-1/2 -translate-y-1/2 left-0 gap-4 pointer-events-auto"
          style={{ translateX: x, transformStyle: "preserve-3d" }}
        >
          {cards.map((card, index) => (
            <Card
              key={card.id}
              index={index}
              x={x}
              center={center}
              depth={depth}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
