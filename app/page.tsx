"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";
import Models from "./_components/Models";

const HomePage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show home page for unauthenticated users
  if (isSignedIn) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <Hero />
      <Models />

      <Footer />
    </div>
  );
};

export default HomePage;
