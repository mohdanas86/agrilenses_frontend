"use client";

import {
  HistoryHeader,
  StatsCards,
  FilterSearch,
  HistoryList,
  useHistoryState,
} from "./_components";

export default function HistoryPage() {
  const {
    scanHistory,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCrop,
    setFilterCrop,
    sortBy,
    setSortBy,
    isClient,
    isLoading,
    error,
    filteredAndSortedHistory,
    getTimeDifference,
    getStats,
    exportHistory,
    refetch,
  } = useHistoryState();

  const stats = getStats();

  if (stats != null) {
    console.log("Fetching scan history...", stats);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-2 sm:pt-4">
        <main className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-center py-12 sm:py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">
                Loading your scan history...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-2 sm:pt-4">
        <main className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-center py-12 sm:py-20">
            <div className="text-center px-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
                <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
                  Error Loading History
                </h3>
                <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  {error}
                </p>
                <button
                  onClick={refetch}
                  className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 font-sans">
      {/* Header Section */}
      <HistoryHeader onExport={exportHistory} />

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto">
        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Filter and Search */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <FilterSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterCrop={filterCrop}
            setFilterCrop={setFilterCrop}
            sortBy={sortBy}
            setSortBy={setSortBy}
            scanHistory={scanHistory}
          />
        </div>

        {/* History List */}
        <div className="mb-4 sm:mb-6">
          <HistoryList
            filteredHistory={filteredAndSortedHistory}
            totalHistory={scanHistory.length}
            isClient={isClient}
            getTimeDifference={getTimeDifference}
          />
        </div>
      </main>
    </div>
  );
}
