  "use client";

  import { useState } from "react";
  import Link from "next/link";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { loginSchema, registerSchema } from "@/lib/validations";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { ThemeToggle } from "@/components/layout/ThemeToggle";
  import Typewriter from "@/components/layout/Typewriter";
  import { signIn } from "next-auth/react";

  export default function AuthForm() {
    const [isFlipped, setIsFlipped] = useState(false);

    // Login Formu
    const loginForm = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
    });

    // Register Formu
    const registerForm = useForm({
      resolver: zodResolver(registerSchema),
      defaultValues: { name: "", email: "", password: "" },
    });

  const onLoginSubmit = async (data: any) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Sayfanın yenilenmesini engelle
      });

      if (res?.error) {
        alert("Invalid email or password. Please try again.");
      } else {
        // Başarılı girişte Dashboard'a yönlendir
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  const onRegisterSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Kayıt başarılıysa otomatik giriş yap
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/",
        });
      } else {
        const error = await response.json();
        alert(error.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("An error occurred during registration");
    }
  };

    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
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
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-gray-900"></span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 min-h-[36px]">
                    <h2 className="text-2xl font-extrabold text-cyan-400 drop-shadow-md">
                      <Typewriter text="Welcome Back" typingSpeed={130} deletingSpeed={120} delay={2000} />
                    </h2>
                    <span className="text-2xl font-extrabold text-cyan-400 animate-blink pb-1 drop-shadow-md">_</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">Login to your account to continue</p>
                </div>

                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email-login" className="text-gray-800 dark:text-gray-200">E-mail</Label>
                    <Input id="email-login" type="email" {...loginForm.register("email")} placeholder="example@42Wels.at" className="border-white/20 bg-white/30 text-black placeholder:text-gray-500 focus-visible:ring-cyan-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-gray-400" />
                    {loginForm.formState.errors.email && (
                      <p className="text-red-500 text-xs text-left">{loginForm.formState.errors.email.message as string}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login" className="text-gray-800 dark:text-gray-200">Password</Label>
                      <Link href="#" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">Forgot my password</Link>
                    </div>
                    <Input id="password-login" type="password" {...loginForm.register("password")} className="border-white/20 bg-white/30 text-black focus-visible:ring-cyan-400 dark:border-white/10 dark:bg-black/30 dark:text-white" />
                    {loginForm.formState.errors.password && (
                      <p className="text-red-500 text-xs text-left">{loginForm.formState.errors.password.message as string}</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 pt-6">
                    <Button type="submit" className="w-full !bg-itf-blue !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-itf-blue/90">Login</Button>
                    <Button className="w-full !bg-hub-2 !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-hub-2/90" type="button">Login with Google</Button>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 pt-1">
                      Have no account?{" "}
                      <button type="button" onClick={() => setIsFlipped(true)} className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">Quickly register</button>
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
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enter your details to register</p>
                </div>

                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name-reg" className="text-gray-800 dark:text-gray-200">Full Name</Label>
                    <Input id="name-reg" type="text" {...registerForm.register("name")} placeholder="example : Emre Yildiz , Simon Dablender etc." className="border-white/20 bg-white/30 text-black placeholder:text-gray-500 focus-visible:ring-cyan-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-gray-400" />
                    {registerForm.formState.errors.name && (
                      <p className="text-red-500 text-xs text-left">{registerForm.formState.errors.name.message as string}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email-reg" className="text-gray-800 dark:text-gray-200">E-mail</Label>
                    <Input id="email-reg" type="email" {...registerForm.register("email")} placeholder="example@42Vienna.com" className="border-white/20 bg-white/30 text-black placeholder:text-gray-500 focus-visible:ring-cyan-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-gray-400" />
                    {registerForm.formState.errors.email && (
                      <p className="text-red-500 text-xs text-left">{registerForm.formState.errors.email.message as string}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password-reg" className="text-gray-800 dark:text-gray-200">Password</Label>
                    <Input id="password-reg" type="password" {...registerForm.register("password")} className="border-white/20 bg-white/30 text-black focus-visible:ring-cyan-400 dark:border-white/10 dark:bg-black/30 dark:text-white" />
                    {registerForm.formState.errors.password && (
                      <p className="text-red-500 text-xs text-left">{registerForm.formState.errors.password.message as string}</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 pt-6">
                    <Button type="submit" className="w-full !bg-itf-blue !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-itf-blue/90">Register</Button>
                    <Button className="w-full !bg-hub-2 !text-white shadow-lg transition-all hover:scale-[1.02] hover:!bg-hub-2/90" type="button">Sign up with Google</Button>
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

