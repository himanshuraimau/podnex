"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { PodcastPlayer } from "@/components/podcasts/PodcastPlayer";
import { ProgressIndicator } from "@/components/podcasts/ProgressIndicator";
import { TranscriptViewer } from "@/components/podcasts/TranscriptViewer";
import { PodcastMetadata } from "@/components/podcasts/PodcastMetadata";
import { StatusBadge } from "@/components/podcasts/StatusBadge";
import { ConfirmDialog } from "@/components/podcasts/ConfirmDialog";
import { Podcast, TranscriptSegment } from "@/lib/types/podcast.types";
import { toast } from "sonner";

export default function PodcastDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const playerRef = useRef<{ seekTo: (time: number) => void } | null>(null);
  const [podcastId, setPodcastId] = useState<string | null>(null);
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Unwrap params and fetch podcast data
  useEffect(() => {
    const initializePage = async () => {
      try {
        const resolvedParams = await params;
        setPodcastId(resolvedParams.id);
        
        // Fetch podcast data from API
        const response = await fetch(`/api/podcasts/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch podcast');
        }
        
        const data = await response.json();
        setPodcast(data);
        setEditedTitle(data.title || "");
      } catch (error) {
        console.error("Error loading podcast:", error);
        // Don't show toast here - let the UI handle the error state
        setPodcast(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [params]);

  const handleBack = () => {
    router.push("/dashboard/podcasts");
  };

  const handleShare = () => {
    if (!podcastId) return;
    
    // Copy link to clipboard
    const url = `${window.location.origin}/dashboard/podcasts/${podcastId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!", {
      description: "Podcast link has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    // TODO: Fetch signed S3 URL and trigger download
    toast.success("Downloading...", {
      description: "Your podcast download will begin shortly.",
    });
    console.log("Downloading podcast...");
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!podcastId) return;
    
    // TODO: API call to delete podcast
    // await fetch(`/api/podcasts/${podcastId}`, { method: 'DELETE' });
    
    toast.error("Podcast deleted", {
      description: "Your podcast has been successfully deleted.",
    });
    router.push("/dashboard/podcasts");
  };

  const handleSaveTitle = async () => {
    if (!podcast || !podcastId) return;
    
    // TODO: API call to update title
    // await fetch(`/api/podcasts/${podcastId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ title: editedTitle })
    // });
    
    setPodcast({ ...podcast, title: editedTitle });
    setIsEditingTitle(false);
    toast.success("Title updated", {
      description: "Your podcast title has been saved.",
    });
  };

  const handleCancelEdit = () => {
    setEditedTitle(podcast?.title || "");
    setIsEditingTitle(false);
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    playerRef.current?.seekTo(timestamp);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading podcast...</p>
          </div>
        </div>
      </div>
    );
  }

  // Podcast not found state
  if (!podcast) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <div className="rounded-full bg-muted p-3">
            <X className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Podcast Not Found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              The podcast you're looking for doesn't exist or has been deleted.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/podcasts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Podcasts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Podcasts
        </Button>

        {/* Title and Actions Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            {/* Editable Title */}
            <div className="space-y-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-2xl md:text-3xl font-serif font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSaveTitle}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10 flex-shrink-0"
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="group flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground">
                    {podcast.title || "Untitled Podcast"}
                  </h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Status and Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <StatusBadge status={podcast.status} />
                <span>•</span>
                <span>{Math.floor((podcast.audioDuration || 0) / 60)}:{String((podcast.audioDuration || 0) % 60).padStart(2, '0')}</span>
                <span>•</span>
                <span>{new Date(podcast.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
              disabled={podcast.status !== "COMPLETED"}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* QUEUED State */}
            {podcast.status === "QUEUED" && (
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-yellow-500/10 p-2">
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                      Queued for Generation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your podcast is in the queue and will begin processing shortly. This typically takes a few moments depending on server load.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Position in queue: Calculating...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROCESSING State */}
            {podcast.status === "PROCESSING" && (
              <ProgressIndicator
                progress={podcast.progress || 0}
                currentStep={podcast.currentStep || "Processing..."}
                startTime={new Date(podcast.createdAt)}
                onCancel={() => console.log("Cancel generation")}
              />
            )}

            {/* COMPLETED State - Audio Player */}
            {podcast.status === "COMPLETED" && podcast.audioUrl && (
              <PodcastPlayer
                ref={playerRef}
                audioUrl={podcast.audioUrl}
                duration={podcast.audioDuration || 0}
                title={podcast.title || "Untitled Podcast"}
              />
            )}

            {/* FAILED State */}
            {podcast.status === "FAILED" && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-red-500/10 p-2">
                    <X className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-1">
                      Generation Failed
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {podcast.errorMessage || "An error occurred while generating your podcast. This could be due to content issues, API limits, or server errors."}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => {
                          // TODO: Retry generation API call
                          toast.success("Retrying generation", {
                            description: "Your podcast has been queued for regeneration.",
                          });
                        }}
                      >
                        Retry Generation
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // TODO: View error details
                          toast.error("Error details", {
                            description: podcast.errorMessage || "No additional error details available.",
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Section - Only show for COMPLETED */}
            {podcast.status === "COMPLETED" && podcast.transcript && Array.isArray(podcast.transcript) && podcast.transcript.length > 0 && (
              <TranscriptViewer 
                transcript={podcast.transcript as TranscriptSegment[]}
                onSeek={handleSeekToTimestamp}
              />
            )}

            {/* No Transcript Available for non-completed podcasts */}
            {podcast.status !== "COMPLETED" && (
              <div className="rounded-lg border border-border/40 bg-card p-8 text-center">
                <div className="text-muted-foreground">
                  <h3 className="font-semibold text-foreground mb-2">Transcript Unavailable</h3>
                  <p className="text-sm">
                    The transcript will be available once the podcast generation is complete.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Status Info Card */}
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status</span>
                    <StatusBadge status={podcast.status} />
                  </div>
                  {podcast.status === "PROCESSING" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium text-foreground">
                        {podcast.progress || 0}%
                      </span>
                    </div>
                  )}
                  {podcast.status === "COMPLETED" && podcast.completedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="text-sm font-medium text-foreground">
                        {new Date(podcast.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                  {podcast.status === "FAILED" && (
                    <div className="pt-2 border-t border-border/40">
                      <span className="text-xs text-red-400 block">
                        Error: {podcast.errorMessage?.substring(0, 100) || "Unknown error"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <PodcastMetadata podcast={podcast} />

              {/* Quick Actions for Completed Podcasts */}
              {podcast.status === "COMPLETED" && (
                <div className="rounded-lg border border-border/40 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="w-full justify-start gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Audio
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="w-full justify-start gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Podcast
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Podcast"
        description="Are you sure you want to delete this podcast? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
