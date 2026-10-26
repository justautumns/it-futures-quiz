import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { questionId, selectedOption } = await req.json();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { correctAnswer: true },
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    const isCorrect = question.correctAnswer === selectedOption;

    return NextResponse.json({ isCorrect }, { status: 200 });
  } catch (error) {
    console.error("Error checking answer:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}