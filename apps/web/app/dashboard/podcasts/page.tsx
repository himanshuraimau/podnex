"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { PodcastList } from "@/components/podcasts/PodcastList";
import { EmptyState } from "@/components/podcasts/EmptyState";
import {
  Podcast,
  PodcastFilters as Filters,
  ViewMode,
} from "@/lib/types/podcast.types";
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List,
  Mic,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const allPodcasts = MOCK_PODCASTS;

  // Apply filters
  const filteredPodcasts = allPodcasts.filter((podcast) => {
    if (filters.status && filters.status !== "ALL") {
      if (podcast.status !== filters.status) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = podcast.title?.toLowerCase().includes(searchLower);
      const contentMatch = podcast.noteContent.toLowerCase().includes(searchLower);
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

  // Stats
  const completedCount = allPodcasts.filter(p => p.status === "COMPLETED").length;
  const processingCount = allPodcasts.filter(p => p.status === "PROCESSING").length;

  const handleCreateNew = () => {
    router.push("/dashboard/podcasts/new");
  };

  const handlePlay = (podcast: Podcast) => {
    router.push(`/dashboard/podcasts/${podcast.id}`);
  };

  const handleDelete = (podcast: Podcast) => {
    console.log("Delete podcast:", podcast.id);
  };

  const handleRetry = (podcast: Podcast) => {
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium">Podcasts</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {allPodcasts.length} podcasts · {completedCount} completed
            {processingCount > 0 && ` · ${processingCount} processing`}
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-foreground text-background hover:bg-foreground/90 shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Podcast
        </Button>
      </div>

      {/* Show empty state if no podcasts at all */}
      {allPodcasts.length === 0 ? (
        <EmptyState onCreateNew={handleCreateNew} />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-3 p-3 rounded-xl border bg-card/50">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search podcasts..."
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9 h-9"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <Select
                value={filters.status || "ALL"}
                onValueChange={(value) => setFilters({ ...filters, status: value as Filters["status"] })}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="QUEUED">Queued</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={filters.sort || "createdAt_desc"}
                onValueChange={(value) => setFilters({ ...filters, sort: value as Filters["sort"] })}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_desc">Newest First</SelectItem>
                  <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                  <SelectItem value="duration_desc">Longest</SelectItem>
                  <SelectItem value="duration_asc">Shortest</SelectItem>
                </SelectContent>
              </Select>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-border" />

              {/* View Toggle */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "grid" 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "list" 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Podcast List or Empty State for filtered results */}
          {paginatedPodcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border/50 bg-card/20">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">
                No podcasts found matching your filters.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setFilters({ ...filters, status: "ALL", search: "" })}
              >
                Clear filters
              </Button>
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
