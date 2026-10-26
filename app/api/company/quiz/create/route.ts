import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Log ile session içeriğini kontrol et
    console.log("🔍 QUIZ CREATE SESSION:", session?.user);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized: No session" }, { status: 401 });
    }

    const { title, questions } = await req.json();

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Kullanıcının şirketini bul
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) {
      // Eğer kullanıcı COMPANY rolünde değilse veya şirketi yoksa hata ver
      return NextResponse.json({ message: "Company not found for this user" }, { status: 403 });
    }

    // Quiz'i ve soruları oluştur
    const quiz = await prisma.quiz.create({
      data: {
        title,
        companyId: company.id,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Quiz created", quizId: quiz.id }, { status: 201 });
  } catch (error) {
    console.error("Quiz create error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}