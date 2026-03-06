export interface LotteryImage {
  id: number;
  url: string;
  name: string;
  created_at: string;
}

export interface Lottery {
  id: number;
  title: string;
  type: 'single' | 'vs';
  host_image_id?: number;
  is_active: number;
  created_at: string;
  images: LotteryImage[];
  hostImage?: LotteryImage;
}

export interface TournamentParticipant {
  id: string;
  name: string;
  image: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
}

export interface TournamentMatch {
  id: string;
  p1: TournamentParticipant;
  p2: TournamentParticipant;
  winnerId?: string;
  stage: string;
  type: 'single' | 'vs';
  timestamp: string;
}

export interface TournamentGroup {
  id: string;
  name: string;
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
}

export interface Tournament {
  id: string;
  title: string;
  types: ('single' | 'vs')[];
  participantCount: number;
  participants: TournamentParticipant[];
  structure: 'group' | 'knockout';
  groupCount: 0 | 2 | 4 | 8;
  advanceCount: 1 | 2 | 4;
  spinTime: 2 | 3 | 5 | 8;
  groupSettings?: {
    stages: string[];
    points: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  groups: TournamentGroup[];
  matches: TournamentMatch[];
  status: 'setup' | 'active' | 'finished';
}
