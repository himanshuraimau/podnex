"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@workspace/ui/components/button";
import { Slider } from "@workspace/ui/components/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PodcastPlayerProps {
  audioUrl: string;
  duration: number;
  title?: string;
}

export interface PodcastPlayerRef {
  seekTo: (time: number) => void;
}

export const PodcastPlayer = forwardRef<PodcastPlayerRef, PodcastPlayerProps>(
  ({ audioUrl, duration, title }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loop, setLoop] = useState(false);
  
  // Expose seekTo method to parent via ref
  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
        // Auto-play when seeking from transcript
        if (!isPlaying) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    },
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsBuffering(false);
      console.error("Error loading audio");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [loop]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || value[0] === undefined) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current || value[0] === undefined) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = () => {
    if (!audioRef.current) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    if (newRate === undefined) return;
    audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(
      0,
      Math.min(duration, audioRef.current.currentTime + seconds)
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    const newLoop = !loop;
    audioRef.current.loop = newLoop;
    setLoop(newLoop);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadAudio = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${title || "podcast"}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateProgress = () => {
    return (currentTime / duration) * 100;
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl shadow-2xl overflow-hidden">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Header with title */}
      <div className="px-6 pt-6 pb-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-serif font-semibold text-foreground truncate">
              {title || "Untitled Podcast"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isBuffering ? "Buffering..." : isLoading ? "Loading..." : "Ready to play"}
            </p>
          </div>
          {isBuffering && (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          )}
        </div>
      </div>

      {/* Main player controls */}
      <div className="px-6 py-6 space-y-6">
        {/* Progress Bar with visual feedback */}
        <div className="space-y-3">
          <div className="relative">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
              disabled={isLoading}
            />
            {/* Progress indicator */}
            <div 
              className="absolute top-0 left-0 h-full bg-primary/10 rounded-full pointer-events-none transition-all duration-100"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-foreground font-medium">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-muted-foreground">
              {calculateProgress().toFixed(0)}%
            </span>
            <span className="font-mono text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Main Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Loop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLoop}
            disabled={isLoading}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              loop && "text-primary hover:text-primary"
            )}
          >
            <Repeat className="w-4 h-4" />
          </Button>

          {/* Skip Back 10s */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-10)}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          {/* Play/Pause - Large button */}
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            disabled={isLoading}
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-0.5" />
            )}
          </Button>

          {/* Skip Forward 10s */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(10)}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          {/* Playback Speed */}
          <Button
            variant="ghost"
            size="sm"
            onClick={changePlaybackRate}
            disabled={isLoading}
            className="font-mono text-sm font-medium text-muted-foreground hover:text-foreground min-w-[3rem] transition-colors"
          >
            {playbackRate}×
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border/20">
          {/* Volume Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24 cursor-pointer"
                disabled={isLoading}
              />
              <span className="text-xs text-muted-foreground font-mono min-w-[2.5rem]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>

          {/* Download Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAudio}
            disabled={isLoading}
            className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading audio...</p>
          </div>
        </div>
      )}
    </div>
  );
});

PodcastPlayer.displayName = "PodcastPlayer";
