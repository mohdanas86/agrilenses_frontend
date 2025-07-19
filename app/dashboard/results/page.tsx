"use client";

import {
  ResultsHeader,
  ScanResultSummary,
  ScannedImage,
  EnvironmentalContext,
  HealthyPlantAdvice,
  ImmediateAction,
  TreatmentOptions,
  PreventionGuide,
  ActionButtons,
  LoadingSpinner,
  useResultsState,
  getDiseaseInfo,
} from "./_components";

export default function ResultsPage() {
  const { scanResult, isClient, handleShare } = useResultsState();

  if (!scanResult) {
    return <LoadingSpinner />;
  }

  const diseaseInfo = scanResult.disease
    ? getDiseaseInfo(scanResult.disease)
    : null;

  return (
    <div className="min-h-screen">
      <ResultsHeader onShare={handleShare} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Image and Basic Results */}
          <div className="space-y-4 sm:space-y-6">
            <ScanResultSummary
              scanResult={scanResult}
              diseaseInfo={diseaseInfo}
              isClient={isClient}
            />
            <ScannedImage scanResult={scanResult} />
            <EnvironmentalContext scanResult={scanResult} isClient={isClient} />
          </div>

          {/* Right Column - Treatment and Management */}
          <div className="space-y-4 sm:space-y-6">
            {scanResult.isHealthy ? (
              <HealthyPlantAdvice />
            ) : (
              diseaseInfo && (
                <>
                  <ImmediateAction diseaseInfo={diseaseInfo} />
                  <TreatmentOptions diseaseInfo={diseaseInfo} />
                  <PreventionGuide diseaseInfo={diseaseInfo} />
                </>
              )
            )}

            <ActionButtons />
          </div>
        </div>
      </main>
    </div>
  );
}
