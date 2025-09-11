import type { Metadata, Viewport } from "next";
import { GlobalProvider } from "@/context/GlobalContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriLenses - Smart Crop Disease Detection",
  description: "AI-powered crop disease detection and management for farmers",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#38c77e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </ClerkProvider>

        {/* =================================================================================== 
        Calling ElevenLabs Convai Widget Script Here Caused Hydration Issues.
        =================================================================================== */}

        {/* <elevenlabs-convai agent-id="agent_6501k4we87cwee6s5b9qwp4rsnkm"></elevenlabs-convai>
        <script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          async
          type="text/javascript"
        ></script> */}
      </body>
    </html>
  );
}
