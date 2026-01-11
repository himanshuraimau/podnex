"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";

export function PodcastDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border/40">
        <div className="container max-w-5xl py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container max-w-5xl py-8">
        <div className="space-y-8">
          {/* Player Skeleton */}
          <div className="rounded-xl border border-border/40 bg-card/30 p-6 space-y-4">
            <Skeleton className="h-2 w-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Transcript Skeleton */}
          <div className="rounded-xl border border-border/40 bg-card/30">
            <div className="p-4 border-b border-border/40">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-12" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Skeleton */}
          <div className="rounded-xl border border-border/40 bg-card/30 p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
