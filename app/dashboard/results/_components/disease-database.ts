import { DiseaseInfo } from './types';

export const diseaseDatabase: Record<string, DiseaseInfo> = {
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
};

export const getDiseaseInfo = (diseaseName: string): DiseaseInfo | null => {
  return diseaseDatabase[diseaseName] || null;
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Low': return 'text-green-600 bg-green-50 border-green-200';
    case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'High': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
