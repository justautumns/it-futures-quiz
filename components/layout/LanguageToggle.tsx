"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  // Şu anki dil (varsayılan 'en')
  const currentLocale = pathname.startsWith("/de") ? "de" : "en";

  const toggleLanguage = () => {
    // Eğer /de ile başlıyorsa /en yap, yoksa /de ekle
    if (currentLocale === "de") {
      router.push(pathname.replace("/de", "") || "/");
    } else {
      router.push(`/de${pathname}`);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10 font-bold"
    >
      {currentLocale === "de" ? "EN" : "DE"}
    </Button>
  );
}