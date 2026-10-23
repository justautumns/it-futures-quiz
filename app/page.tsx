import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Next.js'e bu sayfanın oturum bilgisine göre değişeceğini söylüyoruz
export const instant = false;

export default async function HomePage() {
  const session = await auth();

  // Eğer kullanıcı giriş yapmamışsa /auth sayfasına yönlendir
  if (!session?.user) {
    redirect("/auth");
  }

  // Kullanıcı giriş yapmışsa ve rolü ziyaretçi ise /dashboard'a yönlendir
  if (session.user.role === "VISITOR") {
    redirect("/dashboard");
  }

  // Şirket yetkilisi ise şirket paneline yönlendir
  if (session.user.role === "COMPANY") {
    redirect("/company/dashboard");
  }

  // Admin ise admin paneline yönlendir
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  // Hiçbir koşul uymazsa ana sayfada kal
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Loading your profile...</p>
    </div>
  );
}