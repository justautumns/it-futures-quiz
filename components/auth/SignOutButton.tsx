"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // 1. Oturumu kapat (yönlendirme olmadan)
    await signOut({ redirect: false });
    
    // 2. Tarayıcının o anki origin'ini al ve ana sayfaya yönlendir
    window.location.href = window.location.origin;
  };

  return (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}