/**
 * Podcast Types
 * Frontend type definitions for podcast data
 */

export type PodcastStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type PodcastDuration = 'SHORT' | 'LONG';

export interface Podcast {
  id: string;
  userId: string;
  title?: string;
  noteContent: string;
  status: PodcastStatus;
  duration: PodcastDuration;
  audioUrl?: string;
  audioDuration?: number; // in seconds
  transcript?: string;
  errorMessage?: string;
  progress?: number; // 0-100
  currentStep?: string; // "Generating script...", "Creating audio..."
  createdAt: string;
  updatedAt: string;
}

export interface PodcastFilters {
  search?: string;
  status?: PodcastStatus | 'ALL';
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'duration_desc' | 'duration_asc';
  page?: number;
  limit?: number;
}

export interface PodcastListResponse {
  podcasts: Podcast[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ViewMode = 'grid' | 'list';
