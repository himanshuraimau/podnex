"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PodcastFilters } from "@/components/podcasts/PodcastFilters";
import { PodcastList } from "@/components/podcasts/PodcastList";
import { EmptyState } from "@/components/podcasts/EmptyState";
import {
  Podcast,
  PodcastFilters as Filters,
  ViewMode,
} from "@/lib/types/podcast.types";

// Mock data for development
const MOCK_PODCASTS: Podcast[] = [
  {
    id: "1",
    userId: "user-1",
    title: "Introduction to AI and Machine Learning",
    noteContent: "This is a comprehensive guide to AI...",
    status: "COMPLETED",
    duration: "LONG",
    audioUrl: "https://example.com/audio1.mp3",
    audioDuration: 532,
    transcript: "Welcome to today's episode...",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "user-1",
    title: "Deep Dive into Neural Networks",
    noteContent: "Understanding how neural networks work...",
    status: "PROCESSING",
    duration: "SHORT",
    progress: 65,
    currentStep: "Generating audio...",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "user-1",
    title: "The Future of Web Development",
    noteContent: "Exploring upcoming trends in web dev...",
    status: "COMPLETED",
    duration: "SHORT",
    audioUrl: "https://example.com/audio3.mp3",
    audioDuration: 312,
    transcript: "Today we'll discuss...",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    userId: "user-1",
    title: "Understanding TypeScript Generics",
    noteContent: "A deep dive into TypeScript's type system...",
    status: "FAILED",
    duration: "LONG",
    errorMessage: "Failed to generate audio. Please try again.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    userId: "user-1",
    title: "Building Scalable APIs with Node.js",
    noteContent: "Best practices for API development...",
    status: "QUEUED",
    duration: "SHORT",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    userId: "user-1",
    title: "React Server Components Explained",
    noteContent: "Understanding the new React architecture...",
    status: "COMPLETED",
    duration: "LONG",
    audioUrl: "https://example.com/audio6.mp3",
    audioDuration: 615,
    transcript: "Let's talk about React Server Components...",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function PodcastsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<Filters>({
    status: "ALL",
    sort: "createdAt_desc",
    page: 1,
    limit: 12,
  });

  // For now, use mock data. In production, this will be fetched from API
  const allPodcasts = MOCK_PODCASTS;

  // Apply filters
  const filteredPodcasts = allPodcasts.filter((podcast) => {
    // Status filter
    if (filters.status && filters.status !== "ALL") {
      if (podcast.status !== filters.status) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = podcast.title?.toLowerCase().includes(searchLower);
      const contentMatch = podcast.noteContent
        .toLowerCase()
        .includes(searchLower);
      if (!titleMatch && !contentMatch) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedPodcasts = [...filteredPodcasts].sort((a, b) => {
    switch (filters.sort) {
      case "createdAt_desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "createdAt_asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "duration_desc":
        return (b.audioDuration || 0) - (a.audioDuration || 0);
      case "duration_asc":
        return (a.audioDuration || 0) - (b.audioDuration || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPodcasts = sortedPodcasts.length;
  const totalPages = Math.ceil(totalPodcasts / (filters.limit || 12));
  const startIndex = ((filters.page || 1) - 1) * (filters.limit || 12);
  const endIndex = startIndex + (filters.limit || 12);
  const paginatedPodcasts = sortedPodcasts.slice(startIndex, endIndex);

  const handleCreateNew = () => {
    router.push("/dashboard/podcasts/new");
  };

  const handlePlay = (podcast: Podcast) => {
    // Navigate to detail page
    router.push(`/dashboard/podcasts/${podcast.id}`);
  };

  const handleDelete = (podcast: Podcast) => {
    // TODO: Implement delete with confirmation dialog
    console.log("Delete podcast:", podcast.id);
  };

  const handleRetry = (podcast: Podcast) => {
    // TODO: Implement retry
    console.log("Retry podcast:", podcast.id);
  };

  const handleViewDetails = (podcast: Podcast) => {
    router.push(`/dashboard/podcasts/${podcast.id}`);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-medium mb-2">Podcasts</h1>
        <p className="text-muted-foreground font-sans">
          Manage and listen to your AI-generated podcasts
        </p>
      </div>

      {/* Show empty state if no podcasts at all */}
      {allPodcasts.length === 0 ? (
        <EmptyState onCreateNew={handleCreateNew} />
      ) : (
        <>
          {/* Filters */}
          <PodcastFilters
            filters={filters}
            viewMode={viewMode}
            onFiltersChange={setFilters}
            onViewModeChange={setViewMode}
            onCreateNew={handleCreateNew}
          />

          {/* Podcast List or Empty State for filtered results */}
          {paginatedPodcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground font-sans text-center">
                No podcasts found matching your filters.
                <br />
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <PodcastList
              podcasts={paginatedPodcasts}
              viewMode={viewMode}
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPlay={handlePlay}
              onDelete={handleDelete}
              onRetry={handleRetry}
              onViewDetails={handleViewDetails}
            />
          )}
        </>
      )}
    </div>
  );
}
