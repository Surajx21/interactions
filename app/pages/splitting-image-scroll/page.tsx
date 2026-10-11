import SplittingImage from "./_components/SplittingImage";
import { BBH_Bartle } from "next/font/google";

const bbhBartle = BBH_Bartle({ subsets: ["latin"], weight: "400" });

const imageSrc =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=100&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function Page() {
  return (
    <div className={`bg-black text-white pt-30 ${bbhBartle.className}`}>
      {/* Initial spacer to start with pieces visible */}
      <div className="h-40 relative z-50">
        <h1 className="text-4xl text-center tracking-widest">Scroll down To See</h1>
      </div>

      {/* Splitting Image Component */}
      <SplittingImage
        src={imageSrc}
        columns={5}
        rows={4}
        width={1000}
        height={560}
      />

      {/* End spacer */}
      <div className="h-40 mt-20">
        <h1 className="text-4xl text-center tracking-widest">End of the page</h1>
      </div>
    </div>
  );
}

export default Page;
