"use client";

import { ChevronDownIcon } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type * as React from "react";
import { LayoutGroup, motion } from "motion/react";

import { cn } from "@/lib/utils";

function Accordion({
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root data-slot="accordion" {...props}>
      <LayoutGroup>{children}</LayoutGroup>
    </AccordionPrimitive.Root>
  );
}

const MotionAccordionItem = motion.create(AccordionPrimitive.Item);
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof MotionAccordionItem>) {
  return (
    <MotionAccordionItem
      className={cn("", className)}
      data-slot="accordion-item"
      layout
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 6,
        mass: 0.9,
      }}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left font-semibold text-sm outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
          size={16}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
