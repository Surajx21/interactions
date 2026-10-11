import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Index</h1>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Interactions
          </h2>
          <nav className="space-y-2">
            <Link
              className="block rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
              href="/interactions/ai-bar-interaction"
            >
              AI Bar Interaction
            </Link>
            <Link
              className="block rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
              href="/interactions/split-accordion"
            >
              Split Accordion
            </Link>
          </nav>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Pages (Web Browser Recommended)</h2>
          <nav className="space-y-2">
            <Link
              className="block rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
              href="/pages/smooth-scroll"
            >
              Smooth Scroll
            </Link>
            <Link
              className="block rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
              href="/pages/parallax-scroll"
            >
              Parallax Scroll
            </Link>
            <Link
              className="block rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
              href="/pages/splitting-image-scroll"
            >
              Spliting Image Scroll
            </Link>
            <Link
              className="block rounded-md border px-4 py-3 hover:bg-accent/50 transition-colors"
              href="/pages/svg-parallax-scroll"
            >
              SVG Parallax Scroll
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
