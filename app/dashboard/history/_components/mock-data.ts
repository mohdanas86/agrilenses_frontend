import { ScanRecord } from './types';

// Mock scan history data
export const mockScanHistory: ScanRecord[] = [
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
];
