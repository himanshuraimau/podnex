"use client";

import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProgressBarProps {
    progress: number; // 0-100
    status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
    currentStep?: string | null;
    className?: string;
}

const STEPS = [
    { label: "Queued", min: 0, max: 10 },
    { label: "Generating Script", min: 10, max: 40 },
    { label: "Creating Audio", min: 40, max: 75 },
    { label: "Combining Audio", min: 75, max: 90 },
    { label: "Uploading", min: 90, max: 100 },
];

export function ProgressBar({ progress, status, currentStep, className }: ProgressBarProps) {
    const getCurrentStepInfo = () => {
        if (status === "COMPLETED") return { label: "Completed", index: STEPS.length };
        if (status === "FAILED") return { label: "Failed", index: -1 };
        if (status === "QUEUED") return { label: "Queued", index: 0 };

        // Find current step based on progress
        const stepIndex = STEPS.findIndex(
            (step) => progress >= step.min && progress < step.max
        );
        return {
            label: currentStep || STEPS[stepIndex]?.label || "Processing",
            index: stepIndex,
        };
    };

    const stepInfo = getCurrentStepInfo();

    return (
        <div className={cn("space-y-3", className)}>
            {/* Progress Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
                <div
                    className={cn(
                        "h-full transition-all duration-500 ease-out",
                        status === "COMPLETED" && "bg-green-500",
                        status === "FAILED" && "bg-red-500",
                        status === "PROCESSING" && "bg-blue-500",
                        status === "QUEUED" && "bg-slate-500"
                    )}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                >
                    {status === "PROCESSING" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    )}
                </div>
            </div>

            {/* Status and Progress */}
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    {status === "PROCESSING" && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    )}
                    {status === "COMPLETED" && (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                    )}
                    {status === "FAILED" && (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="font-medium text-slate-300">{stepInfo.label}</span>
                </div>
                <span className="text-slate-400">{Math.round(progress)}%</span>
            </div>

            {/* Step Indicators */}
            {status === "PROCESSING" && (
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => {
                        const isCompleted = progress > step.max;
                        const isCurrent = stepInfo.index === index;
                        const isUpcoming = progress < step.min;

                        return (
                            <div key={step.label} className="flex flex-col items-center gap-1">
                                <div
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-all",
                                        isCompleted && "bg-blue-500 scale-110",
                                        isCurrent && "bg-blue-400 scale-125 animate-pulse",
                                        isUpcoming && "bg-slate-700"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-xs transition-colors",
                                        isCompleted && "text-blue-400",
                                        isCurrent && "text-blue-300 font-medium",
                                        isUpcoming && "text-slate-600"
                                    )}
                                >
                                    {step.label.split(" ")[0]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
