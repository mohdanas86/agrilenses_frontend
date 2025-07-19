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
    <div className="min-h-screen">
      <HistoryHeader onExport={exportHistory} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <StatsCards stats={stats} />

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

        <HistoryList
          filteredHistory={filteredAndSortedHistory}
          totalHistory={scanHistory.length}
          isClient={isClient}
          getTimeDifference={getTimeDifference}
        />
      </main>
    </div>
  );
}
