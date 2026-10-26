import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import EditQuizClient from "./EditQuizClient";

export const instant = false;

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || session.user.role !== "COMPANY") {
    redirect("/company/login");
  }

  // Şirketi bul ve sadece o şirkete ait quizi çek (Güvenlik)
  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
  });

  if (!company) redirect("/company/dashboard");

  const quiz = await prisma.quiz.findUnique({
    where: { 
      id: id,
      companyId: company.id // Sadece kendi quizini düzenleyebilir
    },
    include: { questions: true },
  });

  if (!quiz) {
    return <div className="text-center text-white mt-20">Quiz not found or unauthorized.</div>;
  }

  return <EditQuizClient quiz={quiz} />;
}