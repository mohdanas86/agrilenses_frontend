"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ExternalLink,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Phone,
  Globe,
  Shield,
  Crop,
  Banknote,
  Warehouse,
  ChevronRight,
} from "lucide-react";

// Mock data for government schemes
interface GovernmentScheme {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: "insurance" | "subsidy" | "market" | "credit" | "welfare";
  ministry: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string[];
  documents: string[];
  deadline: string;
  budget: string;
  beneficiaries: string;
  status: "active" | "upcoming" | "closed";
  websiteUrl: string;
  helplineNumber: string;
  lastUpdated: string;
  icon: string;
}

const mockSchemes: GovernmentScheme[] = [
  {
    id: "1",
    name: "Soil Health Card Scheme",
    shortName: "SHC",
    description:
      "Provides soil health cards to farmers with recommendations on appropriate dosage of nutrients and fertilizers",
    category: "subsidy",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: [
      "All farmers with land holdings",
      "Tenant farmers with valid documents",
      "Individual farmers and FPOs",
    ],
    benefits: [
      "Free soil testing",
      "Customized fertilizer recommendations",
      "Improved crop productivity",
      "Reduced input costs",
    ],
    applicationProcess: [
      "Visit nearest Krishi Vigyan Kendra",
      "Submit soil samples",
      "Fill application form",
      "Receive digital soil health card",
    ],
    documents: [
      "Land ownership documents",
      "Aadhaar card",
      "Bank account details",
      "Mobile number verification",
    ],
    deadline: "31st March 2026",
    budget: "₹568 Crores",
    beneficiaries: "14.67 Crore farmers",
    status: "active",
    websiteUrl: "https://soilhealth.dac.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "2024-12-15",
    icon: "🌱",
  },
  {
    id: "2",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "PMFBY",
    description:
      "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage",
    category: "insurance",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: [
      "All farmers (loanee and non-loanee)",
      "Sharecroppers and tenant farmers",
      "Farmers growing notified crops",
    ],
    benefits: [
      "Low premium rates (2% for Kharif, 1.5% for Rabi)",
      "Coverage for all stages of crop cycle",
      "Quick claim settlement",
      "Technology-enabled assessment",
    ],
    applicationProcess: [
      "Visit bank/CSC/insurance company",
      "Fill application form",
      "Pay premium amount",
      "Receive policy certificate",
    ],
    documents: [
      "Land records (Khatauni/Khewat)",
      "Aadhaar card",
      "Bank account details",
      "Sowing certificate",
    ],
    deadline: "31st July 2025 (Kharif)",
    budget: "₹15,695 Crores",
    beneficiaries: "5.5 Crore farmers",
    status: "active",
    websiteUrl: "https://pmfby.gov.in/",
    helplineNumber: "1800-180-1212",
    lastUpdated: "2024-12-10",
    icon: "🛡️",
  },
  {
    id: "3",
    name: "Electronic National Agriculture Market",
    shortName: "eNAM",
    description:
      "Online trading platform for agricultural commodities with transparent price discovery",
    category: "market",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: [
      "Registered farmers",
      "FPOs and SHGs",
      "Licensed traders and buyers",
    ],
    benefits: [
      "Better price realization",
      "Transparent bidding process",
      "Direct market access",
      "Real-time price information",
    ],
    applicationProcess: [
      "Register on eNAM portal",
      "Upload required documents",
      "Get verification done",
      "Start trading online",
    ],
    documents: [
      "Registration certificate",
      "PAN card",
      "Bank account details",
      "Mobile number verification",
    ],
    deadline: "Ongoing registration",
    budget: "₹2,849 Crores",
    beneficiaries: "1.77 Crore farmers",
    status: "active",
    websiteUrl: "https://enam.gov.in/",
    helplineNumber: "1800-270-0224",
    lastUpdated: "2024-12-20",
    icon: "🏪",
  },
  {
    id: "4",
    name: "Kisan Credit Card",
    shortName: "KCC",
    description:
      "Credit facility for farmers to meet their financial needs for agricultural activities",
    category: "credit",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: [
      "Farmers with cultivable land",
      "Tenant farmers and oral lessees",
      "SHGs of farmers",
    ],
    benefits: [
      "Low interest rates (7% per annum)",
      "Flexible repayment",
      "Insurance coverage",
      "ATM cum Debit card facility",
    ],
    applicationProcess: [
      "Apply at nearest bank branch",
      "Submit required documents",
      "Bank verification process",
      "Receive KCC and RuPay card",
    ],
    documents: [
      "Application form",
      "Land documents",
      "Identity and address proof",
      "Passport size photographs",
    ],
    deadline: "Ongoing",
    budget: "₹3,00,000 Crores",
    beneficiaries: "7 Crore farmers",
    status: "active",
    websiteUrl: "https://www.nabard.org/",
    helplineNumber: "1800-180-6484",
    lastUpdated: "2024-12-18",
    icon: "💳",
  },
  {
    id: "5",
    name: "PM-KISAN Samman Nidhi",
    shortName: "PM-KISAN",
    description:
      "Direct income support of ₹6000 per year to small and marginal farmers",
    category: "welfare",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: [
      "Small and marginal farmers",
      "Landholding up to 2 hectares",
      "Families with cultivable land",
    ],
    benefits: [
      "₹6000 annual income support",
      "Direct benefit transfer",
      "Three equal installments",
      "No paperwork required",
    ],
    applicationProcess: [
      "Visit PM-KISAN portal",
      "Fill registration form",
      "Aadhaar verification",
      "Bank account linking",
    ],
    documents: [
      "Aadhaar card",
      "Bank account details",
      "Land ownership records",
      "Mobile number",
    ],
    deadline: "Ongoing registration",
    budget: "₹60,000 Crores",
    beneficiaries: "11 Crore farmers",
    status: "active",
    websiteUrl: "https://pmkisan.gov.in/",
    helplineNumber: "155261",
    lastUpdated: "2024-12-25",
    icon: "💰",
  },
  {
    id: "6",
    name: "Micro Irrigation Fund",
    shortName: "MIF",
    description:
      "Support for micro irrigation systems to achieve water use efficiency in agriculture",
    category: "subsidy",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: [
      "All categories of farmers",
      "Water user associations",
      "Self-help groups",
    ],
    benefits: [
      "90% subsidy for small farmers",
      "Water conservation",
      "Increased crop yield",
      "Energy savings",
    ],
    applicationProcess: [
      "Apply through state nodal agency",
      "Technical verification",
      "Installation approval",
      "Subsidy disbursement",
    ],
    documents: [
      "Land ownership certificate",
      "Water source availability",
      "Technical proposal",
      "Cost estimates",
    ],
    deadline: "31st March 2025",
    budget: "₹5,000 Crores",
    beneficiaries: "50 Lakh farmers",
    status: "active",
    websiteUrl: "https://pmksy.gov.in/",
    helplineNumber: "1800-180-1551",
    lastUpdated: "2024-12-12",
    icon: "💧",
  },
];

const categories = [
  { id: "all", name: "All Schemes", icon: "📋" },
  { id: "insurance", name: "Insurance", icon: "🛡️" },
  { id: "subsidy", name: "Subsidy", icon: "💸" },
  { id: "market", name: "Market", icon: "🏪" },
  { id: "credit", name: "Credit", icon: "💳" },
  { id: "welfare", name: "Welfare", icon: "💰" },
];

export default function GovernmentSchemesPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(mockSchemes);
  const [filteredSchemes, setFilteredSchemes] =
    useState<GovernmentScheme[]>(mockSchemes);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(
    null
  );

  // Filter schemes based on category and search term
  useEffect(() => {
    let filtered = schemes;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (scheme) => scheme.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scheme.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchemes(filtered);
  }, [schemes, selectedCategory, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "insurance":
        return "bg-blue-100 text-blue-800";
      case "subsidy":
        return "bg-green-100 text-green-800";
      case "market":
        return "bg-purple-100 text-purple-800";
      case "credit":
        return "bg-orange-100 text-orange-800";
      case "welfare":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedScheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedScheme(null)}
              className="h-10 w-10 p-0"
            >
              ←
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedScheme.shortName}
              </h1>
              <p className="text-gray-600">{selectedScheme.name}</p>
            </div>
          </div>

          {/* Scheme Details */}
          <div className="space-y-6">
            {/* Overview Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedScheme.icon}</div>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedScheme.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {selectedScheme.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Budget</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {selectedScheme.budget}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Beneficiaries</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {selectedScheme.beneficiaries}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold">Deadline</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      {selectedScheme.deadline}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedScheme.eligibility.map((criteria, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedScheme.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Application Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedScheme.applicationProcess.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-orange-600" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedScheme.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        window.open(`tel:${selectedScheme.helplineNumber}`)
                      }
                    >
                      <Phone className="h-4 w-4" />
                      {selectedScheme.helplineNumber}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        window.open(selectedScheme.websiteUrl, "_blank")
                      }
                    >
                      <Globe className="h-4 w-4" />
                      Official Website
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ministry: {selectedScheme.ministry}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Updated: {selectedScheme.lastUpdated}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Government Schemes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore various government schemes and programs designed to support
            farmers and agricultural development
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search schemes by name, category, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredSchemes.length} scheme
            {filteredSchemes.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" &&
              ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedScheme(scheme)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{scheme.icon}</div>
                    <div>
                      <CardTitle className="text-lg">
                        {scheme.shortName}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {scheme.name}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {scheme.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(scheme.category)}>
                      {scheme.category.charAt(0).toUpperCase() +
                        scheme.category.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(scheme.status)}>
                      {scheme.status.charAt(0).toUpperCase() +
                        scheme.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {scheme.budget}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">
                        {scheme.beneficiaries}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-600">{scheme.deadline}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No schemes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
