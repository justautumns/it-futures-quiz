import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { companyName, contactName, email } = await req.json();

    if (!companyName || !contactName || !email) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Kullanıcı (şirket yetkilisi) zaten var mı?
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: contactName,
          email,
          role: "COMPANY",
        },
      });
    }

    // Şirketi oluştur (eğer kullanıcının zaten bir şirketi yoksa)
    const existingCompany = await prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (!existingCompany) {
      await prisma.company.create({
        data: {
          name: companyName,
          userId: user.id,
        },
      });
    }

    // 6 haneli kod üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Kodu veritabanına kaydet (10 dakika geçerli)
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    // Önce aynı e-posta için eski kodu varsa sil
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    // Yeni kodu kaydet
    const createdToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires: expires,
      },
    });

    console.log(`\n=========================================`);
    console.log(`🏢 COMPANY LOGIN CODE FOR ${email}: ${code}`);
    console.log(`💾 Token saved to DB:`, createdToken);
    console.log(`=========================================\n`);

    return NextResponse.json({ message: "Company registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Company register error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}