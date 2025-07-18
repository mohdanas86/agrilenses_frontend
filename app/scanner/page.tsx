'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, RotateCcw, CheckCircle, AlertTriangle, ArrowLeft, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CropScanner() {
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [selectedCrop] = useState('Tomato')
  const [capturing, setCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      if (!isClient) {
        setError('Please wait for the page to load completely.')
        return
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported in this browser. Please use Chrome, Firefox, or Safari.')
        return
      }

      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setCameraActive(true)
        }
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      let errorMessage = 'Camera access failed. '
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.'
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.'
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Camera is not supported in this browser.'
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.'
      } else {
        errorMessage += `Please check your camera settings and try again. (${err.message})`
      }
      
      setError(errorMessage)
    }
  }, [isClient])

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      setCapturing(true)
      
      // Add flash effect
      setTimeout(() => {
        const canvas = canvasRef.current
        const video = videoRef.current
        
        if (canvas && video) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          
          const context = canvas.getContext('2d')
          if (context) {
            context.drawImage(video, 0, 0)
            const imageData = canvas.toDataURL('image/jpeg', 0.8)
            setCapturedImage(imageData)
            stopCamera()
          }
        }
        setCapturing(false)
      }, 200)
    }
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setError(null)
    startCamera()
  }, [startCamera])

  const analyzeCrop = useCallback(async () => {
    if (!capturedImage) return
    
    setAnalyzing(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock analysis result
      const mockResults = [
        { disease: null, confidence: 96, isHealthy: true },
        { disease: 'Late Blight', confidence: 94, isHealthy: false },
        { disease: 'Early Blight', confidence: 87, isHealthy: false },
        { disease: 'Bacterial Spot', confidence: 92, isHealthy: false },
      ]
      
      const result = mockResults[Math.floor(Math.random() * mockResults.length)]
      
      // Navigate to results page with the analysis result
      const resultData = {
        crop: selectedCrop,
        image: capturedImage,
        ...result,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('scanResult', JSON.stringify(resultData))
      router.push('/results')
      
    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }, [capturedImage, selectedCrop, router])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scanner...</p>
        </div>
      </div>
    )
  }

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
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Crop Scanner
                </h1>
              </div>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-200">
              {selectedCrop}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
              Scanning Instructions
            </CardTitle>
            <CardDescription>
              Follow these guidelines for the best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Use natural lighting when possible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Focus on one leaf at a time</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Keep the leaf centered in frame</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Avoid shadows and reflections</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {capturedImage ? 'Captured Image' : 'Camera'}
            </CardTitle>
            <CardDescription>
              {capturedImage 
                ? 'Review your image before analysis' 
                : 'Position your crop leaf in the frame and capture'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {!cameraActive && !capturedImage && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Camera not active</p>
                    <div className="space-y-2">
                      <Button onClick={startCamera} className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>💡 Camera not working? Try:</p>
                      <ul className="text-left mt-2 space-y-1">
                        <li>• Allow camera permissions when prompted</li>
                        <li>• Use Chrome, Firefox, or Safari browser</li>
                        <li>• Check if camera is being used by another app</li>
                        <li>• Try uploading an image instead</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {cameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full aspect-video bg-black rounded-lg"
                  />
                  
                  {/* Flash effect overlay */}
                  {capturing && (
                    <div className="absolute inset-0 bg-white opacity-80 rounded-lg animate-pulse"></div>
                  )}
                  
                  {/* Camera overlay guide */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white border-dashed rounded-lg w-64 h-64 opacity-50"></div>
                    <div className="absolute top-4 left-4 right-4 text-white text-center">
                      <p className="text-sm bg-black bg-opacity-50 rounded px-2 py-1">
                        Position the leaf within the guide
                      </p>
                    </div>
                  </div>
                  
                  {/* Camera controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <Button
                      size="lg"
                      onClick={capturePhoto}
                      className="rounded-full w-20 h-20 bg-white text-green-600 hover:bg-green-50 shadow-xl border-4 border-green-600 hover:border-green-700 transition-all duration-200 hover:scale-105"
                      title="Capture Photo"
                    >
                      <Camera className="h-10 w-10" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={stopCamera}
                      className="rounded-full w-16 h-16 bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
                      title="Stop Camera"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  {/* Instructions overlay */}
                  <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-white text-sm bg-black bg-opacity-50 rounded-full px-4 py-2 shadow-lg">
                      📸 Click the camera button to capture
                    </p>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured crop"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  
                  {/* Image controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <Button
                      size="lg"
                      onClick={retakePhoto}
                      variant="outline"
                      className="bg-white shadow-lg"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      size="lg"
                      onClick={analyzeCrop}
                      disabled={analyzing}
                      className="bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </main>
    </div>
  )
}
