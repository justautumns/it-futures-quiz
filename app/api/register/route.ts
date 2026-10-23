import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Zod ile doğrula
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Validation failed", errors: result.error.issues }, { status: 400 });
    }

    const { name, email, password } = result.data;

    // Kullanıcı var mı?
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı veritabanına kaydet
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "VISITOR", // Role enum'da VISITOR olarak tanımlıydı
      },
    });

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Register error details:", error); // Terminale detaylı hatayı yazdır
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}