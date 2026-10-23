"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Typewriter from "@/components/layout/Typewriter";
import Background from "@/components/layout/Background"; // Background'u buraya aldık

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // En dış div relative olmalı ki Background absolute çalışsın
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      
      {/* Parçacıklar artık bu sayfaya özel ve hemen arkamızda */}
      <Background />

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Kart: backdrop-blur ve bg-black/40 ile tam saydamlık */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-black/40">
        
        <div className="flex flex-col space-y-1.5 text-center pb-6">
          
          <div className="flex justify-center items-center mb-2">
            <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20">
              {/* İkon ve animasyonlar burada... */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-cyan-500 dark:text-cyan-400 animate-pulse">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white dark:border-gray-900"></span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 min-h-[40px]">
            <h2 className="text-3xl font-extrabold text-cyan-500 dark:text-cyan-400">
              <Typewriter text={isLogin ? "Welcome Back" : "Create an Account"} typingSpeed={130} deletingSpeed={120} delay={2000} />
            </h2>
            <span className="text-3xl font-extrabold text-cyan-500 dark:text-cyan-400 animate-blink pb-1">_</span>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">
            {isLogin ? "Login to your account to continue" : "Enter your details to register"}
          </p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required className="border-white/20 bg-white/5 focus-visible:ring-primary dark:border-white/10 dark:bg-black/20" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="example@email.com" required className="border-white/20 bg-white/5 focus-visible:ring-primary dark:border-white/10 dark:bg-black/20" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <Link href="#" className="text-sm text-cyan-500 dark:text-cyan-400 hover:underline">Forgot my password</Link>
              )}
            </div>
            <Input id="password" type="password" required className="border-white/20 bg-white/5 focus-visible:ring-primary dark:border-white/10 dark:bg-black/20" />
          </div>
        </div>

        <div className="flex flex-col space-y-4 pt-6">
          <Button className="w-full !bg-itf-blue !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-itf-blue/90" type="button">
            {isLogin ? "Login" : "Register"}
          </Button>
          
          <Button className="w-full !bg-hub-2 !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-hub-2/90" type="button">
            {isLogin ? "Login with Google" : "Sign up with Google"}
          </Button>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? "Have no account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-cyan-500 dark:text-cyan-400 hover:underline">
              {isLogin ? "Quickly register" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}