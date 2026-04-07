export type RosterSlots = {
  C: number;
  '1B': number;
  '2B': number;
  '3B': number;
  SS: number;
  OF: number;
  DH: number;
  SP: number;
  RP: number;
  UTIL: number;
  BENCH: number;
};

export type TakenPlayer = [
  playerId: string,
  teamId: string,
  positionSlot: string,
  price: number,
];

export type LeagueTeam = [
  teamId: string,
  teamName: string,
  currentBudget: number,
];

export type League = {
  _id: string;
  externalId?: string;
  name: string;
  description?: string;
  format?: 'roto' | 'h2h-points' | 'h2h-category';
  draftType?: 'auction' | 'snake';
  battingCategories?: string[];
  pitchingCategories?: string[];
  rosterSlots?: RosterSlots;
  totalBudget?: number;
  taken_players?: TakenPlayer[];
  teams?: LeagueTeam[];
  isDefault?: boolean;
  categoryWeights?: Record<string, number>;
};

export type CreateLeagueInput = {
  name: string;
  teams: number;
  draftType: 'auction';
  rosterSlots: RosterSlots;
  totalBudget: number;
  takenPlayers?: TakenPlayer[];
  teamsData?: LeagueTeam[];
};

export interface CreateLeagueResponse {
  success: boolean;
  data: League;
}

export interface LeaguesResponse {
  success: boolean;
  data: League[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeagueResponse {
  success: boolean;
  data: League;
}
