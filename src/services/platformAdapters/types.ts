import type { PlatformType } from "@/types";

export interface PlatformProfile {
  handle: string;
  rating?: number;
  maxRating?: number;
  rankTitle?: string;
  profileUrl: string;
  avatarUrl?: string;
}

export interface PlatformRatingHistoryPoint {
  contestName: string;
  rating: number;
  rank: number;
  date: string;
}

export interface PlatformSubmissionItem {
  id: string;
  problemTitle: string;
  problemUrl: string;
  verdict: string;
  timestamp: string;
}

export interface PlatformCapabilities {
  supportsLiveSync: boolean;
  supportsRatingHistory: boolean;
  supportsSubmissionSync: boolean;
  notes: string;
}

export interface IPlatformAdapter {
  platform: PlatformType;
  getCapabilities(): PlatformCapabilities;
  fetchProfile(handle: string): Promise<PlatformProfile>;
  fetchRatingHistory?(handle: string): Promise<PlatformRatingHistoryPoint[]>;
  fetchSubmissions?(handle: string, count?: number): Promise<PlatformSubmissionItem[]>;
}
