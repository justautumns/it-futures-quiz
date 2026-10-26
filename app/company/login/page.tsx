"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle"; // Eklendi

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  code: z.string().length(6, "Code must be 6 digits"),
});

export default function CompanyLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", code: "" },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const verifyRes = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (verifyRes.ok) {
        await signIn("credentials", {
          email: data.email,
          password: data.code,
          redirect: false,
        });
        router.push("/company/dashboard");
      } else {
        const resData = await verifyRes.json();
        setError(resData.message || "Invalid code");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = form.getValues("email");
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    setIsResending(true);
    try {
      const response = await fetch("/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: "Resend Company", contactName: "Resend User", email }),
      });
      if (response.ok) {
        alert("New code sent! Check your browser console (F12).");
      } else {
        alert("Failed to resend code.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* SAĞ ÜST KÖŞEYE EKLENDİ */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40">
        <h1 className="text-2xl font-bold text-center text-cyan-600 dark:text-cyan-400 mb-6">
          Company Login
        </h1>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} placeholder="hr@techcorp.com" />
          </div>
          <div className="space-y-1.5">
            <Label>6-Digit Code</Label>
            <Input type="text" maxLength={6} {...form.register("code")} placeholder="123456" />
          </div>
          
          <div className="flex flex-col space-y-3 pt-2">
            <Button type="submit" disabled={isLoading} className="w-full !bg-itf-blue !text-white">
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full border-gray-300 text-cyan-600 hover:bg-gray-100 dark:border-white/20 dark:text-cyan-400 dark:hover:bg-black/40"
            >
              {isResending ? "Sending..." : "Didn't get the code? Resend"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link 
            href="/company/auth" 
            className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:underline transition-colors"
          >
            Register your company
          </Link>
        </div>
      </div>
    </div>
  );
}