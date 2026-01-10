"use client";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { Podcast } from "@/lib/types/podcast.types";
import { formatDistanceToNow } from "@/lib/date-utils";
import {
  Play,
  MoreVertical,
  Download,
  FileText,
  Share2,
  RotateCw,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PodcastCardProps {
  podcast: Podcast;
  onPlay?: (podcast: Podcast) => void;
  onDelete?: (podcast: Podcast) => void;
  onRetry?: (podcast: Podcast) => void;
  onViewDetails?: (podcast: Podcast) => void;
}

export function PodcastCard({
  podcast,
  onPlay,
  onDelete,
  onRetry,
  onViewDetails,
}: PodcastCardProps) {
  const isCompleted = podcast.status === "COMPLETED";
  const isProcessing = podcast.status === "PROCESSING";
  const isFailed = podcast.status === "FAILED";
  const isQueued = podcast.status === "QUEUED";

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTitle = () => {
    if (podcast.title) return podcast.title;
    // Generate title from first 50 chars of content
    return podcast.noteContent.slice(0, 50) + (podcast.noteContent.length > 50 ? "..." : "");
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-border transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src="/placeholder-podcast.svg"
          alt={getTitle()}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            // Fallback to gradient background
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Gradient overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={podcast.status} />
        </div>

        {/* Play Button Overlay - Only for completed */}
        {isCompleted && (
          <button
            onClick={() => onPlay?.(podcast)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40"
          >
            <div className="rounded-full bg-primary text-primary-foreground p-4 hover:scale-110 transition-transform">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Metadata */}
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-medium line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {getTitle()}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
            <span>{formatDuration(podcast.audioDuration)}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(podcast.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Progress Bar - Only for processing */}
        {isProcessing && podcast.progress !== undefined && (
          <div className="space-y-2">
            <Progress value={podcast.progress} className="h-2" />
            <p className="text-xs text-muted-foreground font-sans">
              {podcast.currentStep || "Processing..."} • {podcast.progress}%
            </p>
          </div>
        )}

        {/* Error Message - Only for failed */}
        {isFailed && podcast.errorMessage && (
          <p className="text-xs text-red-400 font-sans line-clamp-2">
            {podcast.errorMessage}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {isCompleted && (
            <Button
              onClick={() => onPlay?.(podcast)}
              size="sm"
              className="flex-1 font-sans"
            >
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
          )}

          {isFailed && (
            <Button
              onClick={() => onRetry?.(podcast)}
              size="sm"
              variant="outline"
              className="flex-1 font-sans"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}

          {(isProcessing || isQueued) && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 font-sans"
              disabled
            >
              {isProcessing ? "Processing..." : "Queued"}
            </Button>
          )}

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails?.(podcast)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              
              {isCompleted && (
                <>
                  <DropdownMenuItem onClick={() => onPlay?.(podcast)}>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    View Transcript
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </>
              )}

              {isFailed && (
                <DropdownMenuItem onClick={() => onRetry?.(podcast)}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Retry
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(podcast)}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
