import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import WebSocket from "ws";

export async function POST(req: Request) {
  try {
    const { quizId, userId, points } = await req.json();

    if (!userId || !quizId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Puanı veritabanına kaydet
    const score = await prisma.score.create({
      data: {
        userId,
        quizId,
        points,
      },
      include: {
        user: true, // İsim ve email'i almak için
      }
    });

    // WebSocket sunucusuna yeni skoru bildir
    try {
      const ws = new WebSocket("ws://localhost:8080");
      ws.on('open', () => {
        ws.send(JSON.stringify({ 
          type: 'NEW_SCORE', 
          payload: { 
            quizId, 
            points, 
            userName: score.user.name, 
            userEmail: score.user.email 
          } 
        }));
        ws.close();
      });
    } catch (wsError) {
      console.error("WebSocket error:", wsError);
      // WebSocket hatası olsa bile skor kaydedildi, işlemi durdurma
    }

    return NextResponse.json({ message: "Score saved", score }, { status: 201 });
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}