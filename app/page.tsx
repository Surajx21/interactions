import Link from "next/link";
import type { Route } from "next";
import { Github } from "lucide-react";

const REPO_URL = "https://github.com/Surajx21/interactions";
const GITHUB_TREE = `${REPO_URL}/tree/main/app`;

type DemoLink = {
  title: string;
  href: Route;
  sourcePath: string;
};

const interactionLinks: DemoLink[] = [
  {
    title: "AI Bar Interaction",
    href: "/interactions/ai-bar-interaction",
    sourcePath: `${GITHUB_TREE}/interactions/ai-bar-interaction`,
  },
  {
    title: "Split Accordion",
    href: "/interactions/split-accordion",
    sourcePath: `${GITHUB_TREE}/interactions/split-accordion`,
  },
];

const pageLinks: DemoLink[] = [
  {
    title: "Smooth Scroll",
    href: "/pages/smooth-scroll",
    sourcePath: `${GITHUB_TREE}/pages/smooth-scroll`,
  },
  {
    title: "Parallax Scroll",
    href: "/pages/parallax-scroll",
    sourcePath: `${GITHUB_TREE}/pages/parallax-scroll`,
  },
  {
    title: "Spliting Image Scroll",
    href: "/pages/splitting-image-scroll",
    sourcePath: `${GITHUB_TREE}/pages/splitting-image-scroll`,
  },
  {
    title: "SVG Parallax Scroll",
    href: "/pages/svg-parallax-scroll",
    sourcePath: `${GITHUB_TREE}/pages/svg-parallax-scroll`,
  },
];

function DemoRow({ title, href, sourcePath }: DemoLink) {
  return (
    <div className="flex gap-2">
      <Link
        className="flex-1 rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
        href={href}
      >
        {title}
      </Link>
      <a
        href={sourcePath}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${title} source on GitHub`}
        title={`View ${title} source on GitHub`}
        className="inline-flex w-12 shrink-0 items-center justify-center rounded-md border hover:bg-accent/50 transition-colors"
      >
        <Github className="size-4" />
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Home Page</h1>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Interactions
          </h2>
          <nav className="space-y-2">
            {interactionLinks.map((link) => (
              <DemoRow key={link.href} {...link} />
            ))}
          </nav>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Pages (Web Browser Recommended)
          </h2>
          <nav className="space-y-2">
            {pageLinks.map((link) => (
              <DemoRow key={link.href} {...link} />
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
