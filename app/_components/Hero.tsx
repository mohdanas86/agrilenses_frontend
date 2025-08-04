import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Image Section - 70% */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1744230673231-865d54a0aba4?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

        {/* Logo/Branding overlay on image */}
        <div className="absolute top-8 left-8 z-10">
          <div className="text-white font-bold text-2xl">PlantAI</div>
        </div>
      </div>

      {/* Content Section - 30% */}
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-white px-8 py-12 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-green-600">Plant Disease</span> Detection
              with
              <span className="text-blue-600"> AI Technology</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto rounded-full" />
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Protect your crops with our advanced AI-powered plant disease
            detection system. Simply upload a photo of your plant, and get
            instant, accurate diagnosis with treatment recommendations from our
            cutting-edge machine learning technology.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Instant Disease Detection</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="font-medium">Treatment Recommendations</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/dashboard/scanner">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 min-w-[180px]">
                Start Scanning
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 min-w-[180px]">
                View Dashboard
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 text-sm text-gray-500">
            <p>
              Trusted by{" "}
              <span className="font-semibold text-gray-700">5,000+</span>{" "}
              farmers and agricultural professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
