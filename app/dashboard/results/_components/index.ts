// Types
export type { ScanResult, DiseaseInfo, EnvironmentalData } from './types';

// Data and utilities
export { diseaseDatabase, getDiseaseInfo, getSeverityColor } from './disease-database';

// Components
export { ResultsHeader } from './ResultsHeader';
export { ScanResultSummary } from './ScanResultSummary';
export { ScannedImage } from './ScannedImage';
export { EnvironmentalContext } from './EnvironmentalContext';
export { HealthyPlantAdvice } from './HealthyPlantAdvice';
export { ImmediateAction } from './ImmediateAction';
export { TreatmentOptions } from './TreatmentOptions';
export { PreventionGuide } from './PreventionGuide';
export { ActionButtons } from './ActionButtons';
export { LoadingSpinner } from './LoadingSpinner';

// Hooks
export { useResultsState } from './useResultsState';
