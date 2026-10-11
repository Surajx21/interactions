"use client";
import {
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { data } from "./data";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Syne } from "next/font/google";
import { PlusIcon } from "lucide-react";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const Card = ({
  imageSrc,
  scrollY,
  index,
  total,
}: {
  imageSrc: string;
  scrollY: MotionValue<number>;
  index: number;
  total: number;
}) => {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize + 0.1;

  const tr = useTransform(scrollY, [start, end], ["70%", "90%"]);

  return (
    <motion.div
      style={{
        height: "100dvh",
        width: "100%",
        backgroundImage: `url(${imageSrc})`,
        backgroundPositionY: tr,
        backgroundPositionX: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

function ParallaxScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 80%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const segmentSize = 1 / data.length;
    const index = Math.min(data.length - 1, Math.floor(latest / segmentSize));
    setCurrentIndex(index);
  });

  return (
    <>
      <div ref={ref}>
        {data.map((item, index) => {
          return (
            <Card
              key={item.id}
              imageSrc={item.imageSrc}
              scrollY={scrollYProgress}
              index={index}
              total={data.length}
            />
          );
        })}
      </div>

      <motion.div
        className={"fixed bottom-10 left-10 bg-white p-6 h-42 w-lg " + syne.className}
      >
        <div className="h-full w-full flex justify-between items-end">
          <div className="h-full relative flex gap-4 justify-between items-end w-[50%]">
            <div className="w-full h-full overflow-hidden">
              {data.map((item, index) => {
                return (
                  <motion.img
                    key={index}
                    src={item.imageSrc}
                    className="w-full h-full object-center object-cover"
                    animate={{
                      y: `${currentIndex * -100}%`,
                    }}
                    transition={{
                      ease: "circInOut",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="w-1/2 h-12 overflow-hidden pl-2">
            {data.map((item, index) => {
              return (
                <motion.div
                  key={index}
                  className="flex justify-between items-end align-bottom"
                  animate={{
                    y: `${currentIndex * -100}%`,
                    height: 48,
                  }}
                  transition={{
                    ease: "circInOut",
                  }}
                >
                  <div className="text-lg font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 className="text-lg font-semibold text-nowrap">{item.title}</h2>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center">
          <PlusIcon className="size-5"/>
        </div>
      </motion.div>
    </>
  );
}

export default ParallaxScroll;
