"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Plant Health
            <span className="block text-green-600">Monitoring System</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Detect plant diseases early with AI-powered image analysis. 
            Protect your crops and maximize your harvest with real-time health monitoring.
          </p>
          
          {/* CTA Section will be here */}
          <div className="mt-12">
            <p className="text-gray-500">
              Join thousands of farmers protecting their crops with Agri-Lens
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
