import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { companyId, logoUrl } = await req.json();

    if (!companyId || !logoUrl) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await prisma.company.update({
      where: { id: companyId },
      data: { logoUrl },
    });

    return NextResponse.json({ message: "Logo updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update logo error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}