'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Calendar, Filter, Shield, AlertTriangle, Leaf, ChevronRight, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ScanRecord {
  id: string
  crop: string
  disease: string | null
  confidence: number
  timestamp: Date
  image: string
  isHealthy: boolean
  location?: string
}

// Mock scan history data
const mockScanHistory: ScanRecord[] = [
  {
    id: '1',
    crop: 'Tomato',
    disease: null,
    confidence: 96,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNyA1MEw0MyA1Nkw2MyAzNiIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: true,
    location: 'Field A'
  },
  {
    id: '2',
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 94,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkVGMkYyIi8+CjxwYXRoIGQ9Ik01MCA1MEM1MCA1MCA0NSA0NSA0NSA0NVMzNSAzNSAzNSAzNSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: false,
    location: 'Field B'
  },
  {
    id: '3',
    crop: 'Rice',
    disease: null,
    confidence: 98,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNyA1MEw0MyA1Nkw2MyAzNiIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: true,
    location: 'Field C'
  },
  {
    id: '4',
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 87,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkVGMkYyIi8+CjxwYXRoIGQ9Ik01MCA1MEM1MCA1MCA0NSA0NSA0NSA0NVMzNSAzNSAzNSAzNSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: false,
    location: 'Field A'
  },
  {
    id: '5',
    crop: 'Corn',
    disease: null,
    confidence: 92,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNyA1MEw0MyA1Nkw2MyAzNiIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: true,
    location: 'Field D'
  },
  {
    id: '6',
    crop: 'Bell Pepper',
    disease: 'Bacterial Spot',
    confidence: 89,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkVGMkYyIi8+CjxwYXRoIGQ9Ik01MCA1MEM1MCA1MCA0NSA0NSA0NSA0NVMzNSAzNSAzNSAzNSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: false,
    location: 'Field B'
  },
  {
    id: '7',
    crop: 'Wheat',
    disease: null,
    confidence: 95,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNyA1MEw0MyA1Nkw2MyAzNiIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: true,
    location: 'Field E'
  },
  {
    id: '8',
    crop: 'Apple',
    disease: 'Apple Scab',
    confidence: 91,
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkVGMkYyIi8+CjxwYXRoIGQ9Ik01MCA1MEM1MCA1MCA0NSA0NSA0NSA0NVMzNSAzNSAzNSAzNSIgc3Ryb2tlPSIjRUM0ODk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
    isHealthy: false,
    location: 'Orchard A'
  }
]

export default function HistoryPage() {
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'diseased'>('all')
  const [filterCrop, setFilterCrop] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'crop'>('date')
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    // In a real app, this would fetch from an API
    setScanHistory(mockScanHistory)
  }, [])

  const filteredAndSortedHistory = scanHistory
    .filter(record => {
      const matchesSearch = record.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (record.disease && record.disease.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'healthy' && record.isHealthy) ||
                           (filterStatus === 'diseased' && !record.isHealthy)
      const matchesCrop = filterCrop === 'all' || record.crop === filterCrop

      return matchesSearch && matchesStatus && matchesCrop
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.timestamp.getTime() - a.timestamp.getTime()
        case 'confidence':
          return b.confidence - a.confidence
        case 'crop':
          return a.crop.localeCompare(b.crop)
        default:
          return 0
      }
    })

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

  const getUniqueCrops = () => {
    return [...new Set(scanHistory.map(record => record.crop))].sort()
  }

  const getHealthyCount = () => {
    return scanHistory.filter(record => record.isHealthy).length
  }

  const getDiseasedCount = () => {
    return scanHistory.filter(record => !record.isHealthy).length
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(scanHistory, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = isClient ? 
      `agri-lens-history-${new Date().toISOString().split('T')[0]}.json` :
      'agri-lens-history.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
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
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Scan History
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistory}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{scanHistory.length}</p>
                  <p className="text-sm text-gray-600">Total Scans</p>
                </div>
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{getHealthyCount()}</p>
                  <p className="text-sm text-gray-600">Healthy Plants</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{getDiseasedCount()}</p>
                  <p className="text-sm text-gray-600">Diseases Found</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{Math.round((getHealthyCount() / scanHistory.length) * 100)}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search crops or diseases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'healthy' | 'diseased')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy Only</option>
                <option value="diseased">Diseased Only</option>
              </select>

              {/* Crop Filter */}
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Crops</option>
                {getUniqueCrops().map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence' | 'crop')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="date">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="crop">Sort by Crop</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Records</CardTitle>
            <CardDescription>
              {filteredAndSortedHistory.length} of {scanHistory.length} scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAndSortedHistory.length === 0 ? (
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No scan records found matching your criteria</p>
                <Button 
                  onClick={() => router.push('/scanner')}
                  className="mt-4"
                >
                  Start Your First Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{record.crop}</h3>
                        {record.isHealthy ? (
                          <Badge variant="success" className="flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            Healthy
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {record.disease}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{record.confidence}% confidence</span>
                        <span>•</span>
                        <span>{getTimeDifference(record.timestamp)}</span>
                        {record.location && (
                          <>
                            <span>•</span>
                            <span>{record.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        {isClient ? record.timestamp.toLocaleDateString() : ''}
                      </p>
                      <p className="text-xs text-gray-400">
                        {isClient ? record.timestamp.toLocaleTimeString() : ''}
                      </p>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
