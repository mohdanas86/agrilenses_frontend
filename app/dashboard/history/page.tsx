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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-4 py-0">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your scan history...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-4 py-0">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h3 className="text-red-800 font-semibold mb-2">
                  Error Loading History
                </h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      {/* Header Section */}
      <HistoryHeader onExport={exportHistory} />

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto">
        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Filter and Search */}
        <div className="mb-8">
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
        <div className="mb-6">
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
