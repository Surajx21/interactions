"use client";

import React, { Activity, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";

interface SplittingImageProps {
  src: string;
  columns?: number;
  rows?: number;
  width?: number;
  height?: number;
}

interface PieceData {
  id: number;
  row: number;
  col: number;
  // Random initial offsets
  initialX: number;
  initialY: number;
  initialRotation: number;
  // Stagger delay based on position
  staggerOffset: number;
  // Initial opacity (only few pieces visible at start)
  initialOpacity: number;
}

// Seeded random number generator for consistent values between server/client
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Fisher-Yates shuffle with seeded random
function seededShuffle<T>(array: T[], random: () => number): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate pieces with seeded random for SSR compatibility
function generatePieces(rows: number, columns: number): PieceData[] {
  const piecesArray: PieceData[] = [];
  const totalPieces = rows * columns;
  const random = seededRandom(143); // Fixed seed for consistency

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const id = row * columns + col;
      // Random offsets between -800 and 800 (much wider spread)
      const initialX = (random() - 0.5) * 1600;
      const initialY = (random() - 0.5) * 1200;

      // Calculate distance from origin (0,0) - the further, the lower opacity
      const distance = Math.sqrt(initialX * initialX + initialY * initialY);
      const maxDistance = Math.sqrt(800 * 800 + 600 * 600); // ~1000px max
      // Opacity inversely proportional to distance: closer = higher opacity
      const initialOpacity = Math.max(0.1, 1 - distance / maxDistance);

      piecesArray.push({
        id,
        row,
        col,
        initialX,
        initialY,
        // Random rotation between -90 and 90 degrees
        initialRotation: (random() - 0.5) * 180,
        staggerOffset: 0, // will set after shuffle
        // Opacity based on distance - further = more transparent
        initialOpacity,
      });
    }
  }

  // Shuffle the pieces for random animation order
  const shuffled = seededShuffle(piecesArray, random);
  // Assign staggerOffset based on shuffled order
  shuffled.forEach((piece, i) => {
    piece.staggerOffset = (i / totalPieces) * 0.5;
  });
  return shuffled;
}

// Individual piece component with scroll-based animation
function ImagePiece({
  piece,
  pieceWidth,
  pieceHeight,
  src,
  width,
  height,
  scrollYProgress,
}: {
  piece: PieceData;
  pieceWidth: number;
  pieceHeight: number;
  src: string;
  width: number;
  height: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each piece animates within its own scroll range (staggered)
  const startProgress = piece.staggerOffset;
  const endProgress = startProgress + 0.5; // Each piece takes 50% of scroll to complete

  // Transform values based on scroll progress
  const x = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [piece.initialX, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [piece.initialY, 0]
  );
  const rotate = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [piece.initialRotation, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [0.5, 1]
  );
  const opacity = useTransform(
    scrollYProgress,
    [startProgress, startProgress + 0.15, endProgress],
    [piece.initialOpacity, 1, 1]
  );

  // Determine border radius for corners
  const isTop = piece.row === 0;
  const isBottom = piece.row === Math.floor(height / pieceHeight) - 1;
  const isLeft = piece.col === 0;
  const isRight = piece.col === Math.floor(width / pieceWidth) - 1;
  let borderRadius = "";
  if (isTop && isLeft) borderRadius = "25px 0 0 0";
  else if (isTop && isRight) borderRadius = "0 25px 0 0";
  else if (isBottom && isLeft) borderRadius = "0 0 0 25px";
  else if (isBottom && isRight) borderRadius = "0 0 25px 0";

  return (
    <motion.div
      className="absolute"
      style={{
        width: `${pieceWidth}px`,
        height: `${pieceHeight}px`,
        left: `${piece.col * pieceWidth}px`,
        top: `${piece.row * pieceHeight}px`,
        backgroundImage: `url(${src})`,
        backgroundSize: `${width}px ${height}px`,
        backgroundPosition: `${-piece.col * pieceWidth}px ${
          -piece.row * pieceHeight
        }px`,
        borderRadius,
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
    />
  );
}

export default function SplittingImage({
  src,
  columns = 5,
  rows = 4,
  width = 1000,
  height = 560,
}: SplittingImageProps) {
  // Reference for scroll container
  const containerRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = React.useState<boolean>(false);

  // Calculate piece dimensions
  const pieceWidth = width / columns;
  const pieceHeight = height / rows;

  // Generate pieces with seeded random - consistent between server/client
  const pieces = generatePieces(rows, columns);

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const cardsScroll = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.8, 1], [1, 1.4]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.8) {
      setShowImage(true);
    } else {
      setShowImage(false);
    }
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky container to keep image centered while scrolling */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <Activity mode={showImage ? "hidden" : "visible"}>
            {pieces.map((piece) => (
              <ImagePiece
                key={piece.id}
                piece={piece}
                pieceWidth={pieceWidth}
                pieceHeight={pieceHeight}
                src={src}
                width={width}
                height={height}
                scrollYProgress={cardsScroll}
              />
            ))}
          </Activity>
          <Activity mode={showImage ? "visible" : "hidden"}>
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: `${width}px ${height}px`,
                borderRadius: "25px",
                scale,
                opacity: showImage ? 1 : 0,
              }}
            ></motion.div>
          </Activity>
        </div>
      </div>
      {/* Scroll height - controls animation duration */}
      <div className="h-[250vh]" />
    </div>
  );
}
