import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import LanguageToggle from "@/components/layout/LanguageToggle";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8 text-center">
      
      {/* ÜST BAR: Sadece Sağ Üstteki Butonlar */}
      <div className="w-full max-w-5xl flex justify-end items-center mb-4 md:mb-0 md:absolute md:top-8 md:right-8 gap-2 z-50">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* ANA İÇERİK */}
      <div className="max-w-3xl space-y-6 md:space-y-8 z-10 mt-4 md:mt-0">
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg leading-tight">
          IT Futures <br className="hidden sm:block" /> Scavenger Hunt
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 px-2">
          Discover the future of IT. Visit company booths, scan QR codes, answer quizzes, and win amazing prizes!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-4 md:py-8">
          <div className="p-5 md:p-6 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300">
            <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-2">1. Register</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sign up with your email to join the hunt.</p>
          </div>
          <div className="p-5 md:p-6 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300">
            <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-2">2. Scan</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visit stands and scan their unique QR codes.</p>
          </div>
          <div className="p-5 md:p-6 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300">
            <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-2">3. Win</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Answer quiz questions correctly and climb the leaderboard!</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/auth" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg font-bold !bg-cyan-600 hover:!bg-cyan-500 !text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:scale-105">
              Join the Hunt
            </Button>
          </Link>
          <Link href="/company/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg font-bold border-gray-300 text-gray-700 dark:border-white/20 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              For Exhibitors
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}