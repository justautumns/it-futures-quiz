import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import QuizClient from "./QuizClient";
import { redirect } from "next/navigation";

export const instant = false;

export default async function QuizPage({ params }: { params: Promise<{ companyId: string }> }) {
  const session = await auth();
   if (!session?.user) {
    redirect("/auth");
  }
  const { companyId } = await params;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      quizzes: {
        include: {
          questions: {
            select: {
              id: true,
              text: true,
              options: true,
            },
          },
        },
      },
    },
  });

  // Şirket veya quiz yoksa 404 dön
  if (!company || !company.quizzes || company.quizzes.length === 0) {
    notFound();
  }

  const quiz = company.quizzes[0];

  // Ziyaretçi bu quizi daha önce yapmış mı kontrol et
  if (session?.user?.id) {
    const existingScore = await prisma.score.findFirst({
      where: {
        userId: session.user.id,
        quizId: quiz.id,
      },
    });

    // Eğer daha önce yapmışsa, "Zaten tamamladınız" ekranını göster
    if (existingScore) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">Already Completed</h2>
            <p className="text-gray-800 dark:text-white mb-6">You have already taken this quiz.</p>
            <a href="/dashboard">
              <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-bold">
                Back to Dashboard
              </button>
            </a>
          </div>
        </div>
      );
    }
  }

  // Eğer sorun yoksa quizi başlat
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <QuizClient 
        quiz={quiz} 
        companyName={company.name} 
        companyLogo={company.logoUrl} 
        userId={session?.user?.id || ""} 
      />
    </div>
  );
}