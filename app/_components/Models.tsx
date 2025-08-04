"use client";

import { Camera, Leaf, BarChart3, CheckCircle } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Available crop models
const availableModels = [
  {
    id: "tomato",
    name: "Tomato Disease Detection",
    emoji: "🍅",
    description:
      "Detect and identify common tomato plant diseases with high accuracy AI analysis",
    accuracy: "96.2%",
    diseases: [
      "Bacterial Spot",
      "Early Blight",
      "Late Blight",
      "Leaf Mold",
      "Septoria Leaf Spot",
      "Target Spot",
      "Yellow Leaf Curl Virus",
      "Mosaic Virus",
      "Healthy Plant",
    ],
    status: "Active",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    accentColor: "text-red-600",
  },
  {
    id: "potato",
    name: "Potato Disease Detection",
    emoji: "🥔",
    description:
      "Advanced AI model for detecting potato plant diseases and health conditions",
    accuracy: "94.8%",
    diseases: ["Late Blight", "Early Blight", "Healthy Plant"],
    status: "Active",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    accentColor: "text-yellow-600",
  },
];

const Models = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
              AI Models
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Detection Models
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our trained AI models to detect diseases in your crops
            with high accuracy
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {availableModels.map((model) => (
            <Card
              key={model.id}
              className={`${model.bgColor} ${model.borderColor} border-2 hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{model.emoji}</div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {model.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {model.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          {model.accuracy}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-700">
                  {model.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Disease Detection Capabilities */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Detects {model.diseases.length} Conditions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {model.diseases.slice(0, 6).map((disease, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-white"
                      >
                        {disease}
                      </Badge>
                    ))}
                    {model.diseases.length > 6 && (
                      <Badge variant="outline" className="text-xs bg-white">
                        +{model.diseases.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/dashboard/scanner`}>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium">
                    <Camera className="h-4 w-4 mr-2" />
                    Scan {model.name.split(" ")[0]} Plants
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Protect Your Crops?
            </h3>
            <p className="text-gray-600 mb-6">
              Start using our AI-powered disease detection system to keep your
              plants healthy and maximize your harvest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/scanner">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="px-8">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Models;
