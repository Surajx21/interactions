"use client";

import { Oswald } from "next/font/google";
import { cn } from "@/lib/utils";
import { maskImageUrl, scrollImages } from "./data";
import {
  useScroll,
  motion,
  useTransform,
  MotionValue,
  useSpring,
} from "motion/react";
import { useRef } from "react";
const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface HeaderProps extends React.ComponentProps<"div"> {
  noAbsolute?: boolean;
}

const Header = ({
  className,
  children,
  noAbsolute = false,
  ...props
}: HeaderProps) => {
  return (
    <div
      className={cn(
        "text-8xl font-bold leading-[0.85] tracking-[-0.02rem] text-center w-1/2 z-1",
        noAbsolute
          ? ""
          : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
};

const Row = ({
  images,
}: {
  images: string[];
  index: number;
  scrollProgress: MotionValue<number>;
}) => {
  // Images only in some rows
  return (
    <div className="row w-full p-8 flex gap-8">
      {images.map((src, idx) => {
        return src ? (
          <div className="flex-1 aspect-5/7 overflow-hidden" key={idx}>
            <motion.img
              src={src}
              alt=""
              width={100}
              height={100}
              className="w-full h-full opacity-50 saturate-0 object-cover"
            />
          </div>
        ) : (
          <div className="flex-1" key={idx}></div>
        );
      })}
    </div>
  );
};

const Section = ({ className, ...props }: React.ComponentProps<"section">) => {
  return (
    <section
      className={cn(
        "relative w-screen h-svh bg-[#161616] text-white overflow-hidden",
        className
      )}
      {...props}
    />
  );
};

const Word = ({
  value,
  range,
  children,
}: {
  value: MotionValue<number>;
  range: number[];
  children: React.ReactNode;
}) => {
  // Reveal happens between the start/end of the specific range
  const opacity = useTransform(value, range, [0, 1]);

  // Add a subtle slide-up effect for smoothness
  const y = useTransform(value, range, [20, 0]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        display: "inline-block",
        marginRight: "0.25em",
      }}
    >
      {children}
    </motion.span>
  );
};

const Spotlight = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const maskScale = useTransform(scrollYProgress, [0.4, 0.85], ["0%", "140%"]);
  const springScale = useSpring(maskScale, {
    damping: 40,
    stiffness: 400,
  });

  const textShowing = useTransform(scrollYProgress, [0.85, 1], [0, 100]);

  const sentence = "The Last Frame Hits Hard";
  const words = sentence.split(" ");

  return (
    <Section
      className="bg-[#101010] h-auto overflow-visible relative"
      ref={ref}
    >
      <Header
        noAbsolute
        className="sticky top-0 h-screen z-50 flex justify-center items-center w-full"
      >
        Where Frame Fade Into Fate
      </Header>

      <motion.div className="absolute top-0 left-0 w-screen h-[300svh] flex flex-col justify-between will-change-transform">
        {scrollImages.map((images, idx) => (
          <Row
            key={idx}
            images={images}
            index={idx}
            scrollProgress={scrollYProgress}
          />
        ))}
      </motion.div>

      <motion.div
        className="sticky top-0 left-0 w-screen h-svh z-50"
        style={{
          WebkitMask: "url(/mask-icon.svg) center/contain no-repeat",
          mask: "url(/mask-icon.svg) center/contain no-repeat",
          maskSize: springScale,
          overflow: "hidden",
        }}
      >
        <div className="w-full h-full">
          <motion.img
            src={maskImageUrl}
            alt=""
            className="h-full w-full object-cover"
            style={{
              scale: springScale,
            }}
          />
        </div>
        <Header>
          {words.map((word, i) => {
            const step = 100 / words.length;
            const start = i * step;
            const end = start + step;

            return (
              <Word key={i} value={textShowing} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </Header>
      </motion.div>

      <div className="h-[250svh]"></div>
    </Section>
  );
};

function Page() {
  return (
    <div className={oswald.className}>
      <Section className="flex items-center justify-center">
        <Header>SVG Parallax Scroll</Header>
      </Section>

      <Spotlight />

      <Section className="outro flex items-center justify-center">
        <Header>Other Sections</Header>
      </Section>
      <section></section>
    </div>
  );
}

export default Page;
