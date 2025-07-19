'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, CheckCircle, AlertTriangle, Shield, ExternalLink, Clock, MapPin, Thermometer } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ScanResult {
  crop: string
  disease: string | null
  confidence: number
  isHealthy: boolean
  image: string
  timestamp: string
}

interface DiseaseInfo {
  name: string
  description: string
  symptoms: string[]
  causes: string[]
  organicTreatments: string[]
  chemicalTreatments: string[]
  prevention: string[]
  severity: 'Low' | 'Medium' | 'High'
}

const diseaseDatabase: Record<string, DiseaseInfo> = {
  'Late Blight': {
    name: 'Late Blight',
    description: 'A serious fungal disease that affects potatoes and tomatoes, especially during cool, wet weather.',
    symptoms: [
      'Dark brown to black lesions on leaves',
      'White fuzzy growth on leaf undersides',
      'Rapid spread during humid conditions',
      'Fruit rot with dark, sunken areas'
    ],
    causes: [
      'Phytophthora infestans fungus',
      'High humidity (>90%)',
      'Cool temperatures (15-20°C)',
      'Poor air circulation'
    ],
    organicTreatments: [
      'Remove and destroy affected plants',
      'Apply copper-based fungicides',
      'Use baking soda spray (1 tsp per liter)',
      'Improve air circulation'
    ],
    chemicalTreatments: [
      'Mancozeb fungicide',
      'Chlorothalonil',
      'Metalaxyl-based products',
      'Copper sulfate'
    ],
    prevention: [
      'Choose resistant varieties',
      'Ensure proper spacing',
      'Avoid overhead watering',
      'Regular field inspection'
    ],
    severity: 'High'
  },
  'Early Blight': {
    name: 'Early Blight',
    description: 'A common fungal disease affecting tomatoes and potatoes, causing characteristic target-like lesions.',
    symptoms: [
      'Circular brown spots with target-like rings',
      'Yellowing of lower leaves',
      'Defoliation starting from bottom',
      'Stem cankers near soil line'
    ],
    causes: [
      'Alternaria solani fungus',
      'High temperature and humidity',
      'Plant stress and poor nutrition',
      'Wounds from insects or tools'
    ],
    organicTreatments: [
      'Remove affected leaves immediately',
      'Apply neem oil spray',
      'Use compost tea',
      'Mulch around plants'
    ],
    chemicalTreatments: [
      'Azoxystrobin',
      'Mancozeb',
      'Chlorothalonil',
      'Propiconazole'
    ],
    prevention: [
      'Crop rotation',
      'Proper fertilization',
      'Drip irrigation',
      'Remove plant debris'
    ],
    severity: 'Medium'
  },
  'Bacterial Spot': {
    name: 'Bacterial Spot',
    description: 'A bacterial disease causing small, dark spots on leaves and fruit of tomatoes and peppers.',
    symptoms: [
      'Small, dark brown spots on leaves',
      'Spots may have yellow halos',
      'Fruit lesions with raised, rough texture',
      'Defoliation in severe cases'
    ],
    causes: [
      'Xanthomonas bacteria',
      'High humidity and warm temperatures',
      'Water splash spreading bacteria',
      'Contaminated seeds or tools'
    ],
    organicTreatments: [
      'Remove infected plant parts',
      'Apply copper sprays',
      'Use beneficial bacteria',
      'Improve drainage'
    ],
    chemicalTreatments: [
      'Copper hydroxide',
      'Streptomycin (where legal)',
      'Copper sulfate',
      'Bactericides'
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Avoid overhead irrigation',
      'Sanitize tools regularly',
      'Proper plant spacing'
    ],
    severity: 'Medium'
  }
}

export default function ResultsPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [showFullTreatment, setShowFullTreatment] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const storedResult = localStorage.getItem('scanResult')
    if (storedResult) {
      setScanResult(JSON.parse(storedResult))
    }
  }, [])

  const handleShare = async () => {
    if (!scanResult) return
    
    const shareData = {
      title: `Agri-Lens - ${scanResult.crop} Scan Result`,
      text: `${scanResult.isHealthy ? 'Healthy' : scanResult.disease} detected with ${scanResult.confidence}% confidence`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback for browsers without native sharing
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' - ' + shareData.url)}`
        window.open(whatsappUrl, '_blank')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const getDiseaseInfo = (diseaseName: string): DiseaseInfo | null => {
    return diseaseDatabase[diseaseName] || null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200'
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'High': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scan results...</p>
        </div>
      </div>
    )
  }

  const diseaseInfo = scanResult.disease ? getDiseaseInfo(scanResult.disease) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Scan Results
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Results */}
          <div className="space-y-6">
            {/* Scan Result Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {scanResult.isHealthy ? (
                      <>
                        <Shield className="h-6 w-6 text-green-600 mr-2" />
                        Healthy Plant
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                        Disease Detected
                      </>
                    )}
                  </CardTitle>
                  <Badge 
                    variant={scanResult.isHealthy ? "success" : "destructive"}
                    className="text-sm"
                  >
                    {scanResult.confidence}% Confidence
                  </Badge>
                </div>
                <CardDescription>
                  {isClient && scanResult ? `Analysis completed on ${new Date(scanResult.timestamp).toLocaleString()}` : 'Analysis completed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Crop Type</p>
                    <p className="text-lg font-semibold text-gray-900">{scanResult.crop}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`text-lg font-semibold ${scanResult.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                      {scanResult.isHealthy ? 'Healthy' : scanResult.disease}
                    </p>
                  </div>
                </div>

                {!scanResult.isHealthy && diseaseInfo && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Severity Level</span>
                      <Badge className={`${getSeverityColor(diseaseInfo.severity)} border`}>
                        {diseaseInfo.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{diseaseInfo.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Captured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Scanned Image</CardTitle>
                <CardDescription>
                  The image analyzed by our AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={scanResult.image}
                  alt="Scanned crop"
                  className="w-full rounded-lg shadow-sm"
                />
              </CardContent>
            </Card>

            {/* Environmental Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Environmental Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temperature</span>
                    <span className="text-sm font-medium flex items-center">
                      <Thermometer className="h-4 w-4 mr-1" />
                      28°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Humidity</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Weather</span>
                    <span className="text-sm font-medium">Partly Cloudy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Scan Time</span>
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {isClient && scanResult ? new Date(scanResult.timestamp).toLocaleTimeString() : '--:--'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Treatment and Management */}
          <div className="space-y-6">
            {scanResult.isHealthy ? (
              /* Healthy Plant Advice */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Healthy Plant Detected
                  </CardTitle>
                  <CardDescription>
                    Your crop appears to be in good health. Here are some tips to maintain its condition.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Preventive Measures</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Continue regular monitoring</li>
                        <li>• Maintain proper watering schedule</li>
                        <li>• Ensure adequate nutrition</li>
                        <li>• Keep the growing area clean</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Schedule next inspection in 7-10 days</li>
                        <li>• Watch for early signs of stress</li>
                        <li>• Maintain optimal growing conditions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Disease Treatment Information */
              diseaseInfo && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-700">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        Immediate Action Required
                      </CardTitle>
                      <CardDescription>
                        Follow these steps immediately to prevent disease spread
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">First Steps</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Isolate affected plants immediately</li>
                            <li>• Remove and destroy infected leaves</li>
                            <li>• Avoid working with plants when wet</li>
                            <li>• Clean tools with disinfectant</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Symptoms to Watch</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {diseaseInfo.symptoms.map((symptom, index) => (
                              <li key={index}>• {symptom}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Treatment Options</CardTitle>
                      <CardDescription>
                        Choose the treatment method that best fits your farming approach
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">🌱 Organic Treatments</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {diseaseInfo.organicTreatments.map((treatment, index) => (
                              <li key={index}>• {treatment}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">🧪 Chemical Treatments</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {diseaseInfo.chemicalTreatments.map((treatment, index) => (
                              <li key={index}>• {treatment}</li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-500 mt-2">
                            ⚠️ Always follow label instructions and local regulations
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Prevention for Future</CardTitle>
                      <CardDescription>
                        Prevent recurrence with these management practices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Disease Causes</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {diseaseInfo.causes.map((cause, index) => (
                              <li key={index}>• {cause}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Prevention Methods</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {diseaseInfo.prevention.map((method, index) => (
                              <li key={index}>• {method}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/scanner')}
                className="w-full"
                size="lg"
              >
                Scan Another Crop
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/history')}
                className="w-full"
              >
                View Scan History
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://extension.umn.edu/diseases', '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More About Plant Diseases
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
