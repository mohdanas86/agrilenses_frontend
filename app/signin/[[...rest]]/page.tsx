"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf } from "lucide-react";
import Header from "@/app/_components/Header";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border-0 bg-transparent",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
              formButtonPrimary:
                "bg-green-600 hover:bg-green-700 text-white font-medium h-11",
              formFieldInput:
                "h-11 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500",
              footerActionLink:
                "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium",
            },
          }}
          forceRedirectUrl={redirectUrl}
          signUpForceRedirectUrl={redirectUrl}
          signUpUrl="/signup"
        />
      </div>
    </>
  );
};

export default SignInPage;
