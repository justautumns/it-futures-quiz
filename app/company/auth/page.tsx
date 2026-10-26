"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/ThemeToggle"; // Eklendi

const companyAuthSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
});

export default function CompanyAuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(companyAuthSchema),
    defaultValues: { companyName: "", contactName: "", email: "" },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Company registered! Check the browser console for your login code.");
        router.push("/company/login");
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
          Register Your Company
        </h1>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input {...form.register("companyName")} placeholder="Tech Corp" />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Person</Label>
            <Input {...form.register("contactName")} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} placeholder="hr@techcorp.com" />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full !bg-itf-blue !text-white">
            {isLoading ? "Registering..." : "Register Company"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link 
            href="/company/login" 
            className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:underline transition-colors"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}