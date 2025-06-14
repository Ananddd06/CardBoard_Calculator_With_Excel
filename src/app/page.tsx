"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/calculation");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-black px-4 py-10">
      {/* Navigation Bar */}
      <nav className="w-full max-w-6xl flex items-center justify-between py-4 px-2 mb-8">
        <div className="flex items-center gap-2">
          <Image
            src="data:image/png;base64,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"
            alt="Logo"
            width={40}
            height={40}
            className="drop-shadow"
            priority
          />
          <span className="font-bold text-xl text-orange-500 tracking-tight">
            Cardboard AI
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 flex-1 justify-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-orange-500 font-serif drop-shadow-lg max-w-3xl">
          Calculate Cardboard Box Weight Instantly
        </h1>
        <h2 className="text-xl sm:text-2xl text-gray-200 font-mono font-medium max-w-2xl">
          Modern, privacy-first calculator for{" "}
          <span className="text-orange-400 font-bold">3PLY</span>,{" "}
          <span className="text-orange-400 font-bold">5PLY</span>, and{" "}
          <span className="text-orange-400 font-bold">7PLY</span> packaging. No
          sign-up. No data leaves your device.
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/file.svg"
            alt="Cardboard Illustration"
            width={120}
            height={120}
            className="drop-shadow-xl"
            priority
          />
        </div>
        <Button
          className="px-10 py-4 rounded-full bg-orange-500 hover:bg-blue-600 transition-colors text-white font-bold text-2xl shadow-xl tracking-wide mt-4"
          onClick={handleStart}
        >
          Start Calculating
        </Button>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mt-20 flex flex-col items-center gap-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-500 mb-6 tracking-tight w-full text-left">
          FEATURES
        </h2>
        <div className="w-full flex flex-col md:flex-row items-start gap-12">
          {/* Large Video/GIF on the left */}
          <div className="flex-1 flex justify-start">
            <Image
              src="/Users/anand/Desktop/nextjs/cardboard-weight-calculator/Images/32186288-b62e23a0-bd6f-11e7-83d9-ee83d9671f60.gif"
              alt="Live Excel Table Demo"
              className="rounded-xl shadow-lg border border-orange-900"
              style={{ maxWidth: "600px", width: "100%", maxHeight: 520, objectFit: "cover" }}
            />
          </div>
          {/* Features text on the right */}
          <ul className="flex-1 flex flex-col gap-8 text-lg text-gray-200 font-medium text-left">
            <li>
              <span className="text-orange-400 font-bold">📊 See Data in Real Time:</span>
              <span className="text-gray-400 ml-2">
                Instantly view your cardboard calculations in a live, Excel-like table.
              </span>
            </li>
            <li>
              <span className="text-orange-400 font-bold">⬇️ Download Database as Excel:</span>
              <span className="text-gray-400 ml-2">
                Export all your entries to Excel for your convenience and records.
              </span>
            </li>
            <li>
              <span className="text-orange-400 font-bold">📏 Intuitive Input:</span>
              <span className="text-gray-400 ml-2">
                Enter Length, Width, Height, Ply, and GSM in a clean, easy-to-use form.
              </span>
            </li>
            <li>
              <span className="text-orange-400 font-bold">🔒 100% Privacy:</span>
              <span className="text-gray-400 ml-2">
                All calculations are done in your browser. No data leaves your device.
              </span>
            </li>
          </ul>
        </div>
        <div className="text-left text-gray-400 text-base mt-2 w-full">
          <span className="text-orange-400 font-bold">Tip:</span> Download your database in Excel format for your convenience and future reference.
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-gray-500 text-sm font-mono text-center border-t border-orange-900 pt-6 w-full">
        <div>
          &copy; {new Date().getFullYear()} &mdash;{" "}
          <span className="font-semibold text-orange-500">Done by J Anand</span>
        </div>
        <div>Cardboard Weight Calculator. All rights reserved.</div>
      </footer>
    </main>
  );
}
