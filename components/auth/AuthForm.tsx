"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Typewriter from "@/components/layout/Typewriter";
import { signIn } from "next-auth/react";

// Register Şeması (Şifre yok, Consent var)
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  marketingConsent: z.boolean().optional(),
});

// Login Şeması (Email ve Kod)
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 digits"),
});

export default function AuthForm() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  // Register Formu
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", marketingConsent: false },
  });

  // Login Formu (Şifre yerine kod)
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", code: "" },
  });

  const onRegisterSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        loginForm.setValue("email", data.email);
        setIsFlipped(false);
        alert("Code generated! Check your browser console (F12) to find your 6-digit code.");
      } else {
        const resData = await response.json();
        setError(resData.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok) {
        await signIn("credentials", {
          email: data.email,
          password: data.code,
          redirect: false,
        });
        window.location.href = "/dashboard";
      } else {
        setError(resData.message || "Invalid code");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = loginForm.getValues("email");
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Resend User", email }),
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
      
      {/* ÜST BAR: Geri Dön ve Tema Butonları */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="perspective-1000 w-full max-w-[420px] h-[560px]">
        <div
          className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          
          {/* ========================================= */}
          {/* ÖN YÜZ (LOGIN) */}
          {/* ========================================= */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col justify-center transition-shadow duration-300">
              
              <div className="flex flex-col space-y-3 text-center pb-6">
                <div className="flex justify-center items-center">
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-cyan-400 animate-pulse">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 min-h-[36px]">
                  <h2 className="text-2xl font-extrabold text-cyan-400 drop-shadow-md">
                    <Typewriter text="Welcome Back" typingSpeed={130} deletingSpeed={120} delay={2000} />
                  </h2>
                  <span className="text-2xl font-extrabold text-cyan-400 animate-blink pb-1 drop-shadow-md">_</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Enter your email and 6-digit code</p>
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-login" className="text-gray-800 dark:text-gray-200">E-mail</Label>
                  <Input id="email-login" type="email" {...loginForm.register("email")} placeholder="example@42Wels.at" className="border-white/20 bg-white/30 text-black dark:border-white/10 dark:bg-black/30 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="code-login" className="text-gray-800 dark:text-gray-200">Magic Code (6 digits)</Label>
                  <Input id="code-login" type="text" maxLength={6} {...loginForm.register("code")} placeholder="123456" className="border-white/20 bg-white/30 text-black dark:border-white/10 dark:bg-black/30 dark:text-white" />
                </div>

                <div className="flex flex-col space-y-3 pt-6">
                  <Button type="submit" disabled={isLoading} className="w-full !bg-itf-blue !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-itf-blue/90">
                    {isLoading ? "Verifying..." : "Login"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="w-full border-white/20 text-cyan-600 dark:text-cyan-400 hover:bg-white/10 dark:hover:bg-black/40"
                  >
                    {isResending ? "Sending..." : "Didn't get the code? Resend"}
                  </Button>

                  <div className="text-center text-sm text-gray-600 dark:text-gray-300 pt-1">
                    Need an account?{" "}
                    <button type="button" onClick={() => setIsFlipped(true)} className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">Register here</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ========================================= */}
          {/* ARKA YÜZ (REGISTER) */}
          {/* ========================================= */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 dark:shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col justify-center transition-shadow duration-300">
              
              <div className="flex flex-col space-y-3 text-center pb-6">
                <div className="flex justify-center items-center">
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-cyan-400 animate-pulse">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" x2="19" y1="8" y2="14" />
                      <line x1="22" x2="16" y1="11" y2="11" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 min-h-[36px]">
                  <h2 className="text-2xl font-extrabold text-cyan-400 drop-shadow-md">
                    <Typewriter text="Create an Account" typingSpeed={130} deletingSpeed={120} delay={2000} />
                  </h2>
                  <span className="text-2xl font-extrabold text-cyan-400 animate-blink pb-1 drop-shadow-md">_</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Join the scavenger hunt</p>
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name-reg" className="text-gray-800 dark:text-gray-200">Full Name</Label>
                  <Input id="name-reg" type="text" {...registerForm.register("name")} placeholder="John Doe" className="border-white/20 bg-white/30 text-black dark:border-white/10 dark:bg-black/30 dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-reg" className="text-gray-800 dark:text-gray-200">E-mail</Label>
                  <Input id="email-reg" type="email" {...registerForm.register("email")} placeholder="example@42Vienna.com" className="border-white/20 bg-white/30 text-black dark:border-white/10 dark:bg-black/30 dark:text-white" />
                </div>
                
                <div className="flex items-start space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    {...registerForm.register("marketingConsent")} 
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <Label htmlFor="consent" className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                    I agree that IT-Futures and 42 Wels may contact me in the future regarding career opportunities and events.
                  </Label>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  <Button type="submit" disabled={isLoading} className="w-full !bg-itf-blue !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-itf-blue/90">
                    {isLoading ? "Generating..." : "Register"}
                  </Button>
                  <div className="text-center text-sm text-gray-600 dark:text-gray-300 pt-1">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setIsFlipped(false)} className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">Login here</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}