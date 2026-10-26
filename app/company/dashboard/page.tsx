import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CompanyDashboardClient from "./CompanyDashboardClient";

export const instant = false;

export default async function CompanyDashboard() {
  const session = await auth();

  // Proxy zaten oturumu kontrol ediyor, burada sadece veri çekiyoruz
  if (!session?.user) {
    return <div className="text-center text-white mt-20">Please login to access this page.</div>;
  }

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    include: {
      quizzes: {
        include: {
          scores: {
            include: { user: true },
            orderBy: { points: "desc" },
          },
        },
      },
    },
  });

  if (!company) {
    return <div className="text-center text-white mt-20">Company not found.</div>;
  }

  return <CompanyDashboardClient company={company} />;
}