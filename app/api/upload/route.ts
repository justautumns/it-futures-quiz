import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // public/uploads klasörünü oluştur (yoksa)
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Dosya adını benzersiz yap (timestamp + orijinal isim)
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filePath = join(uploadDir, uniqueFileName);

    // Dosyayı diske yaz
    await writeFile(filePath, buffer);

    // Veritabanına kaydetmek için sadece dosya yolunu (URL) dön
    return NextResponse.json({ url: `/uploads/${uniqueFileName}` }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}