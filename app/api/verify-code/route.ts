import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    
    // Gelen veriyi logla
    console.log("🔍 VERIFY REQUEST:", { email, code });

    // Veritabanından kodu bul
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
        expires: { gt: new Date() }, // Süresi geçmemiş olmalı
      },
    });

    // Bulunan token'ı logla
    console.log("🔍 FOUND TOKEN:", verificationToken);

    if (!verificationToken) {
      // Eğer token bulunamadıysa, süresi geçmiş olabilir mi diye kontrol et
      const expiredToken = await prisma.verificationToken.findFirst({
        where: { identifier: email, token: code }
      });
      console.log("🔍 EXPIRED TOKEN CHECK:", expiredToken);
      
      return NextResponse.json({ message: "Invalid or expired code" }, { status: 401 });
    }

    // Kodu kullanıldıktan sonra sil
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ 
      message: "Login successful", 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    }, { status: 200 });

  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}