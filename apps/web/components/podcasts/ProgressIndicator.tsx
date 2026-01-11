"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  progress: number; // 0-100
  currentStep: string;
  startTime: Date;
  onCancel?: () => void;
}

export function ProgressIndicator({
  progress,
  currentStep,
  startTime,
  onCancel,
}: ProgressIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Estimate remaining time based on progress
  const estimateRemainingTime = () => {
    if (progress === 0) return null;
    const estimatedTotal = (elapsedTime / progress) * 100;
    const remaining = Math.max(0, Math.floor(estimatedTotal - elapsedTime));
    return remaining;
  };

  const remainingTime = estimateRemainingTime();

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-500/10 p-2">
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Generating Your Podcast
            </h3>
            <p className="text-sm text-muted-foreground">
              This usually takes 2-4 minutes
            </p>
          </div>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground font-medium">{currentStep}</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Time Information */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/40">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-muted-foreground/70">Elapsed:</span>{" "}
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          {remainingTime !== null && (
            <div>
              <span className="text-xs text-muted-foreground/70">
                Estimated remaining:
              </span>{" "}
              <span className="font-mono">{formatTime(remainingTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center justify-between pt-2">
        {[
          { label: "Script", threshold: 25 },
          { label: "Audio", threshold: 60 },
          { label: "Processing", threshold: 85 },
          { label: "Finalizing", threshold: 100 },
        ].map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                progress >= step.threshold
                  ? "bg-amber-400"
                  : "bg-muted-foreground/20"
              )}
            />
            <span
              className={cn(
                "text-xs transition-colors",
                progress >= step.threshold
                  ? "text-foreground"
                  : "text-muted-foreground/50"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
