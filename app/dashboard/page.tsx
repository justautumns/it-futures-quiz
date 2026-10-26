import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db"; // Prisma'yı import etmeyi unutma
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SignOutButton } from "@/components/auth/SignOutButton";
import Link from "next/link";

export const instant = false;

export default async function VisitorDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  // Kullanıcının tüm skorlarını veritabanından çek
  const scores = await prisma.score.findMany({
    where: { userId: session.user.id },
  });

  // Toplam puanı ve çözülen quiz sayısını hesapla
  const totalPoints = scores.reduce((sum, score) => sum + score.points, 0);
  const quizzesCompleted = scores.length;

  return (
    <div className="relative flex min-h-screen flex-col items-center p-4 md:p-8">
      {/* Üst Bar */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 border-b border-gray-300 dark:border-white/10 pb-4 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            Welcome, {session.user.name || "Visitor"}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Role: {session.user.role}</p>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* QR Okutma Kartı */}
        <div className="rounded-2xl border border-white/40 bg-white/40 p-6 md:p-8 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col items-center text-center transition-all duration-300">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600 dark:text-cyan-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800 dark:text-white">Scan a Company QR</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Visit a company stand, scan their QR code, and take the quiz to earn points!</p>
          
          <Link href="/scan" className="w-full mt-auto">
            <Button className="w-full !bg-cyan-600 hover:!bg-cyan-500 !text-white shadow-lg transition-all hover:scale-[1.02]">Open Camera</Button>
          </Link>
        </div>

        {/* Puan Kartı */}
        <div className="rounded-2xl border border-white/40 bg-white/40 p-6 md:p-8 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300">
          <h2 className="text-lg md:text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">Your Stats</h2>
          
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-white/10 pb-4 mb-4">
            <span className="text-gray-600 dark:text-gray-400">Total Points</span>
            <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{totalPoints}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-white/10 pb-4">
            <span className="text-gray-600 dark:text-gray-400">Quizzes Completed</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white">{quizzesCompleted}</span>
          </div>
        </div>

      </div>
    </div>
  );
}