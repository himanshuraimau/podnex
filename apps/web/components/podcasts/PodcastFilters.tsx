"use client";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Search, Grid3x3, List, Plus } from "lucide-react";
import { PodcastFilters as Filters, ViewMode } from "@/lib/types/podcast.types";
import { cn } from "@/lib/utils";

interface PodcastFiltersProps {
  filters: Filters;
  viewMode: ViewMode;
  onFiltersChange: (filters: Filters) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateNew?: () => void;
}

export function PodcastFilters({
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onCreateNew,
}: PodcastFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Top Row: Search and Create Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search podcasts..."
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 font-sans"
          />
        </div>

        {/* Create Button */}
        <Button onClick={onCreateNew} className="font-sans whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Bottom Row: Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select
            value={filters.status || "ALL"}
            onValueChange={(value: string) =>
              onFiltersChange({
                ...filters,
                status: value as Filters["status"],
              })
            }
          >
            <SelectTrigger className="w-[140px] font-sans">
              <SelectValue placeholder="All Status" />
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
            onValueChange={(value: string) =>
              onFiltersChange({
                ...filters,
                sort: value as Filters["sort"],
              })
            }
          >
            <SelectTrigger className="w-[160px] font-sans">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Recent First</SelectItem>
              <SelectItem value="createdAt_asc">Oldest First</SelectItem>
              <SelectItem value="duration_desc">Longest Duration</SelectItem>
              <SelectItem value="duration_asc">Shortest Duration</SelectItem>
            </SelectContent>
          </Select>

          {/* Results Count (optional) */}
          <span className="text-sm text-muted-foreground font-sans">
            {/* This will be populated from parent */}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "h-8 w-8 p-0",
              viewMode === "grid" && "bg-muted"
            )}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "h-8 w-8 p-0",
              viewMode === "list" && "bg-muted"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
