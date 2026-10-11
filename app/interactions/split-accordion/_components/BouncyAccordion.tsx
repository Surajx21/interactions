"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Palette, PenTool, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";

const items = [
  {
    content:
      "My design approach combines aesthetics with functionality. I focus on creating intuitive user experiences, clean visual hierarchies, and pixel-perfect interfaces that align with modern design principles and brand guidelines.",
    icon: Palette,
    id: "1",
    title: "What's your design philosophy?",
  },
  {
    content:
      "I work with Figma for UI/UX design, Adobe Creative Suite for graphics, and prototyping tools like Framer. I also use design systems and component libraries to ensure consistency across projects.",
    icon: PenTool,
    id: "2",
    title: "What design tools do you use?",
  },
  {
    content:
      "Typically, a project takes 2-4 weeks depending on complexity. This includes research, wireframing, visual design, prototyping, and revisions to deliver a polished final product.",
    icon: Clock,
    id: "3",
    title: "How long does a design project take?",
  },
  {
    content:
      "I include up to 3 rounds of revisions in every project. I believe in collaborative iteration, gathering feedback at each stage to ensure the final design meets your vision and business goals.",
    icon: RefreshCw,
    id: "4",
    title: "Do you offer design revisions?",
  },
];

export default function BouncyAccordion() {
  const [currentOpenIndex, setCurrentOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 w-lg">
      <Accordion
        className="w-full py-2"
        type="single"
        collapsible
        onValueChange={(value) => {
          const index = items.findIndex((item) => item.id === value);
          setCurrentOpenIndex(index === -1 ? null : index);
        }}
      >
        {items.map((item, idx) => (
          <AccordionItem
            className={cn(
              "py-2 px-4 border-x first:border-t first:rounded-t-2xl last:border-b last:rounded-b-2xl hover:bg-accent/50 transition-colors",
              {
                "border rounded-2xl my-4 last:mb-0 first:mt-0":
                  currentOpenIndex === idx,
                "border-b rounded-b-2xl": currentOpenIndex === idx + 1,
                "border-t rounded-t-2xl": currentOpenIndex === idx - 1,
              }
            )}
            key={item.id}
            value={item.id}
          >
            <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
              <span className="flex items-center gap-3">
                <item.icon
                  aria-hidden="true"
                  className="shrink-0 opacity-60 stroke-3"
                  size={16}
                />
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="ps-7 pb-2 text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
