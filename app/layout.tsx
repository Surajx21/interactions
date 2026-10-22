import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { SmoothScroll } from "@/components/smooth-scroll";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "Interactions by Suraj Shah",
  description:
    "A collection of interactive web experiments built with React and Motion.",
  metadataBase: new URL("https://" + process.env.VERCEL_URL),
  openGraph: {
    title: "Interactions by Suraj Shah",
    description:
      "A collection of interactive web experiments built with React and Motion.",
    url: "https://interactions-green.vercel.app/",
    siteName: "Interactions by Suraj Shah",
    images: [
      {
        url: "./opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Interactions by Suraj Shah",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactions by Suraj Shah",
    description:
      "A collection of interactive web experiments built with React and Motion.",
    images: ["./opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${bricolage.className} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
      <Analytics />
    </html>
  );
}
