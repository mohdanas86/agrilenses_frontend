'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Camera, History, Globe, Search, Sun, CloudRain, Languages, Leaf, ChevronRight, Shield, AlertTriangle } from 'lucide-react'

// Types
interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  location: string
}

interface ScanResult {
  id: string
  crop: string
  disease: string | null
  confidence: number
  timestamp: Date
  image: string
  isHealthy: boolean
}

// Mock data
const mockWeather: WeatherData = {
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  location: 'Chennai, TN'
}

const mockRecentScans: ScanResult[] = [
  {
    id: '1',
    crop: 'Tomato',
    disease: null,
    confidence: 96,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNyA1MEw0MyA1Nkw2MyAzNiIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: true
  },
  {
    id: '2',
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 94,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkVGMkYyIi8+CjxwYXRoIGQ9Ik01MCA1MEM1MCA1MCA0NSA0NSA0NSA0NVMzNSAzNSAzNSAzNSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: false
  },
  {
    id: '3',
    crop: 'Rice',
    disease: null,
    confidence: 98,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNyA1MEw0MyA1Nkw2MyAzNiIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: true
  }
]

const supportedCrops = [
  { name: 'Tomato', image: '🍅', count: 8 },
  { name: 'Potato', image: '🥔', count: 6 },
  { name: 'Rice', image: '🌾', count: 4 },
  { name: 'Wheat', image: '🌾', count: 3 },
  { name: 'Corn', image: '🌽', count: 5 },
  { name: 'Bell Pepper', image: '🫑', count: 4 },
  { name: 'Apple', image: '🍎', count: 3 },
  { name: 'Grape', image: '🍇', count: 2 },
]

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
]

export default function Home() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [searchTerm, setSearchTerm] = useState('')
  const [showLanguages, setShowLanguages] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredCrops = supportedCrops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (date: Date) => {
    if (!isClient) return ''
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeDifference = (date: Date) => {
    if (!isClient) return ''
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 rounded-full p-2">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agri-Lens</h1>
                <p className="text-sm text-gray-500">Smart Crop Health Monitor</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="flex items-center space-x-2"
                >
                  <Languages className="h-4 w-4" />
                  <span>{languages.find(lang => lang.code === currentLanguage)?.native}</span>
                </Button>
                
                {showLanguages && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code)
                          setShowLanguages(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {lang.native} ({lang.name})
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => router.push('/history')}>
                <History className="h-4 w-4 mr-2" />
                My Scans
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Agri-Lens
            </h2>
            <p className="text-lg text-gray-600">
              AI-powered crop disease detection for healthier harvests
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {currentTime && isClient ? formatTime(currentTime) : ''}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Action Section */}
          <div className="lg:col-span-2">
            {/* Primary Action Card */}
            <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white border-none">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Camera className="h-8 w-8 mr-3" />
                  Scan Your Crop
                </CardTitle>
                <CardDescription className="text-green-100">
                  Take a photo of your crop leaf to get instant disease detection and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold text-lg py-6"
                  onClick={() => router.push('/scanner')}
                >
                  <Camera className="h-6 w-6 mr-2" />
                  Start Diagnosis
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Crop Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Select Your Crop
                </CardTitle>
                <CardDescription>
                  Choose from our supported crops for accurate disease detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search crops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredCrops.map((crop) => (
                    <button
                      key={crop.name}
                      className="group p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
                    >
                      <div className="text-3xl mb-2">{crop.image}</div>
                      <h3 className="font-medium text-gray-900 group-hover:text-green-700">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {crop.count} diseases detected
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Scans
                </CardTitle>
                <CardDescription>
                  Your latest crop health assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Leaf className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{scan.crop}</h3>
                          {scan.isHealthy ? (
                            <Badge variant="success" className="flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Healthy
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {scan.disease}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{scan.confidence}% confidence</span>
                          <span>•</span>
                          <span>{getTimeDifference(scan.timestamp)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Sun className="h-8 w-8 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">
                      {mockWeather.temperature}°C
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{mockWeather.condition}</p>
                  <p className="text-sm text-gray-500">{mockWeather.location}</p>
                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <CloudRain className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{mockWeather.humidity}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Scans</span>
                    <span className="font-semibold text-green-600">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Healthy Plants</span>
                    <span className="font-semibold text-green-600">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Diseases Detected</span>
                    <span className="font-semibold text-red-600">14</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold text-blue-600">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Scanning Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span>Use good lighting for better results</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span>Focus on one leaf at a time</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span>Avoid shadows and blurred images</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span>Take photos of affected areas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
