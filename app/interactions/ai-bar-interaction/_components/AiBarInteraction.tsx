"use client";

import {
  ArrowRight,
  AudioLines,
  MicVocal,
  Music2,
  Scissors,
  Sparkles,
  Timer,
} from "lucide-react";

import type { ElementType } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

type TabValue = "music" | "effects";

const IconContainer = ({
  icon: Icon,
  value,
  activeTab,
  setActiveTab,
}: {
  icon: ElementType;
  value: TabValue;
  activeTab: TabValue;
  setActiveTab: (value: TabValue) => void;
}) => {
  return (
    <button
      className="h-full aspect-square p-1 flex items-center justify-center relative cursor-pointer"
      onClick={() => setActiveTab(value)}
    >
      {value === activeTab && (
        <motion.div
          layoutId="icon-button-background"
          className="absolute w-[calc(100%-8px)] aspect-square bg-gray-100 rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          "relative z-10 stroke-3 hover:scale-105 duration-200 text-gray-900 size-6",
          {
            "text-gray-500": value !== activeTab,
          }
        )}
      />
    </button>
  );
};

const MusicIcons = () => {
  return (
    <motion.div
      className="flex items-center gap-4 h-full overflow-hidden justify-end"
      initial={{ opacity: 0, filter: "blur(10px)", x: 20 }}
      animate={{
        paddingLeft: 24,
        paddingRight: 16,
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
      }}
      exit={{ opacity: 0, filter: "blur(10px)", x: 20 }}
      transition={{ duration: 0.15 }}
    >
      <Scissors className="size-6 stroke-3 text-slate-800" />
      <Timer className="size-6 stroke-3 text-slate-800" />
      <MicVocal className="size-6 stroke-3 text-slate-800" />
      <AudioLines className="size-6 stroke-3 text-slate-800" />
    </motion.div>
  );
};

const SparkleIcons = () => {
  return (
    <motion.div
      className="flex items-center gap-4 h-full justify-between"
      initial={{ opacity: 0, filter: "blur(10px)", x: 20 }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
      }}
      exit={{ opacity: 0, filter: "blur(10px)", x: 20 }}
      transition={{ duration: 0.15 }}
    >
      <input
        type="text"
        autoFocus
        className="w-full h-full focus:outline-none placeholder:text-lg pl-2 text-lg"
        placeholder="Refine with AI"
      />
      <div className="h-full aspect-square flex items-center justify-center rounded-full bg-white shadow">
        <ArrowRight className="size-6 stroke-3" />
      </div>
    </motion.div>
  );
};

const AiBarInteraction = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("music");

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 200, damping: 8, mass: 1 }}
      className="bg-gray-100 rounded-full flex items-center p-1 h-16"
    >
      <div className="bg-white rounded-full h-full flex shadow-md">
        <IconContainer
          icon={Music2}
          value="music"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <IconContainer
          icon={Sparkles}
          value="effects"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <motion.div
        className="h-full relative"
        initial={false}
        animate={{ width: activeTab === "music" ? 200 : 240 }}
        transition={{ type: "spring", stiffness: 150, damping: 8, mass: 1 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "music" && <MusicIcons key="music" />}
          {activeTab === "effects" && <SparkleIcons key="effects" />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AiBarInteraction;
