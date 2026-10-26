import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, questions } = await req.json();

    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) return NextResponse.json({ message: "Company not found" }, { status: 404 });

    // Quizin gerçekten bu şirkete ait olduğunu doğrula
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id, companyId: company.id },
    });

    if (!existingQuiz) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Eski soruları sil ve yeni soruları ekle
    await prisma.question.deleteMany({
      where: { quizId: id },
    });

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Quiz updated", quiz: updatedQuiz }, { status: 200 });
  } catch (error) {
    console.error("Quiz update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}