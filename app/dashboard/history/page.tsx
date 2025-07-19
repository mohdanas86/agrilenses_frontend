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
    filteredAndSortedHistory,
    getTimeDifference,
    getStats,
    exportHistory,
  } = useHistoryState();

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      {/* Header Section */}
      <HistoryHeader onExport={exportHistory} />

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-4 py-0">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Scan History
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Review your plant disease detection history and analysis results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Filter and Search */}
        <div className="mb-6 sm:mb-8">
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
