import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, marketingConsent } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email, marketingConsent: marketingConsent || false, role: "VISITOR" },
      });
    }

    // 6 haneli kod üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Kodu veritabanına kaydet (10 dakika geçerli)
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 dakika

    // Önce aynı e-posta için eski kodu varsa sil
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    // Yeni kodu kaydet
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires: expires,
      },
    });

    console.log(`\n=========================================`);
    console.log(`🔑 LOGIN CODE FOR ${email}: ${code}`);
    console.log(`=========================================\n`);

    return NextResponse.json({ message: "Code generated successfully" }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}