"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
              Join Plant Health Monitor and start monitoring your plants
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white font-medium h-11",
                formFieldInput: "h-11 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500",
                footerActionLink: "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium",
              }
            }}
            forceRedirectUrl="/dashboard"
            signInForceRedirectUrl="/dashboard"
            signInUrl="/signin"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
