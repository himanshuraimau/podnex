"use client";

import { useState, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { TranscriptSegment } from "@/lib/types/podcast.types";
import { 
  Search, 
  Download, 
  Copy, 
  FileText,
  FileCode,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
  onSeek?: (timestamp: number) => void;
}

export function TranscriptViewer({ transcript, onSeek }: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Filter transcript based on search
  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) return transcript;
    const query = searchQuery.toLowerCase();
    return transcript.filter(
      (segment) =>
        segment.text.toLowerCase().includes(query) ||
        segment.speaker.toLowerCase().includes(query)
    );
  }, [transcript, searchQuery]);

  const handleTimestampClick = (timestamp: number) => {
    onSeek?.(timestamp);
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = () => {
    const text = transcript
      .map(
        (segment) =>
          `[${formatTimestamp(segment.timestamp)}] ${segment.speaker}: ${segment.text}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    const text = transcript
      .map(
        (segment) =>
          `[${formatTimestamp(segment.timestamp)}] ${segment.speaker}: ${segment.text}`
      )
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transcript.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsSRT = () => {
    const srt = transcript
      .map((segment, index) => {
        const start = formatSRTTime(segment.timestamp);
        const end = formatSRTTime(
          index < transcript.length - 1 && transcript[index + 1]
            ? transcript[index + 1]!.timestamp
            : segment.timestamp + 5
        );
        return `${index + 1}\n${start} --> ${end}\n${segment.speaker}: ${segment.text}\n`;
      })
      .join("\n");
    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transcript.srt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsVTT = () => {
    const vtt =
      "WEBVTT\n\n" +
      transcript
        .map((segment, index) => {
          const start = formatVTTTime(segment.timestamp);
          const end = formatVTTTime(
            index < transcript.length - 1 && transcript[index + 1]
              ? transcript[index + 1]!.timestamp
              : segment.timestamp + 5
          );
          return `${start} --> ${end}\n${segment.speaker}: ${segment.text}\n`;
        })
        .join("\n");
    const blob = new Blob([vtt], { type: "text/vtt" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transcript.vtt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSRTTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
  };

  const formatVTTTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  return (
    <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        <h3 className="text-lg font-serif font-semibold text-foreground">
          Transcript
        </h3>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-background/50"
            />
          </div>

          {/* Copy Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportAsText}>
                <FileText className="w-4 h-4 mr-2" />
                Export as TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsSRT}>
                <FileCode className="w-4 h-4 mr-2" />
                Export as SRT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsVTT}>
                <FileCode className="w-4 h-4 mr-2" />
                Export as VTT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredTranscript.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? "No results found" : "No transcript available"}
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {filteredTranscript.map((segment, index) => (
              <div
                key={index}
                className="p-4 hover:bg-accent/5 transition-colors group"
              >
                <div className="flex gap-4">
                  {/* Timestamp */}
                  <button
                    onClick={() => handleTimestampClick(segment.timestamp)}
                    className="flex-shrink-0 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    {formatTimestamp(segment.timestamp)}
                  </button>

                  {/* Speaker & Text */}
                  <div className="flex-1 space-y-1">
                    <div
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        segment.speaker === "HOST"
                          ? "text-primary"
                          : "text-amber-400"
                      )}
                    >
                      {segment.speaker}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {segment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredTranscript.length > 0 && (
        <div className="p-3 border-t border-border/40 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            {filteredTranscript.length} segment
            {filteredTranscript.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}
    </div>
  );
}
