"use client";

import { PodcastCard } from "./PodcastCard";
import { Podcast, ViewMode } from "@/lib/types/podcast.types";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface PodcastListProps {
  podcasts: Podcast[];
  viewMode: ViewMode;
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPlay?: (podcast: Podcast) => void;
  onDelete?: (podcast: Podcast) => void;
  onRetry?: (podcast: Podcast) => void;
  onViewDetails?: (podcast: Podcast) => void;
}

export function PodcastList({
  podcasts,
  viewMode,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onPlay,
  onDelete,
  onRetry,
  onViewDetails,
}: PodcastListProps) {
  // Loading Skeletons
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Podcast Grid/List */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
            : "space-y-3"
        )}
      >
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            viewMode={viewMode}
            onPlay={onPlay}
            onDelete={onDelete}
            onRetry={onRetry}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="font-sans"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // Show first, last, current, and adjacent pages
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span
                      key={page}
                      className="px-2 text-muted-foreground font-sans"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0 font-sans",
                    currentPage === page && "pointer-events-none"
                  )}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="font-sans"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
