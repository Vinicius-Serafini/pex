export type User = {
  uid: string;
  name: string;
  avatar: string;
  mail: string;
};

export type Team = {
  uid?: string;
  name: string;
  owner: User | string; //User.id 
  players?: Array<User>;
  lineup?: RawLineup
};

export type RawLineup = {
  'ATC-E'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'ATC-D'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'MLA-E'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'MEC-E'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'MEC-D'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'MLA-D'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'LAT-E'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'ZAG-E'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'ZAG-D'?: {
    first: User | {},
    substitutes: Array<User>
  },
  'LAT-D'?: {
    first: User | {},
    substitutes: Array<User>
  },
  GOL?: {
    first: User | {},
    substitutes: Array<User>
  }
}

export type Lineup = Array<Array<Position>>


export type Position = {
  position: PositionLabel,
  first: User,
  substitutes: Array<User>
} | null;

export type PositionLabel =
  'GOL' | 'LAT-E' | 'LAT-D' |
  'ZAG-E' | 'ZAG-D' | 'LIB' |
  'ALA-E' | 'ALA-D' | 'VOL-E' |
  'VOL-D' | 'VOL' | 'MLA-E' |
  'MLA-D' | 'MEC' | 'MEC-E' |
  'MEC-D' | 'MEA-E' | 'MEA-D' |
  'MCA' | 'MCA-D' | 'MCA-E' |
  'PON-E' | 'PON-D' | 'ATC' |
  'ATC-E' | 'ATC-D';

export type LineupObject = {
  get: () => Lineup,
  isLineupFull: boolean;
  addPlayer: (position: PositionLabel, player: User) => boolean;
  addSubstitutePlayer: (position: PositionLabel, player: User) => boolean;
  remove: (player: User) => boolean
}

export type TeamObject = {
  get: () => Team;
  removePlayer: (player: User) => void;
}

export type Player = {
  user: User,
  position: PositionLabel
}

export type Match = {
  uid: string;
  name: string;
  host: string; //Team.id
  guest: string; //Team.id
  schedule: Date;
  place: Place;
}

export type MatchResult = {
  uid: string;
  match_id: string;
  goals: Array<{ user_id: string }>;
  cards: Array<{ type: 'RED' | 'YELLOW'; user_id: string }>;
}

export type Invite = {
  uid: string;
  expires_at: Date | string;
  created_at: Date | string;
  updated_at?: Date | string;
  status: InviteStatus,
  updated_by?: string //userId
}

export type InviteStatus = "ACCEPTED" | "REJECTED" | "PENDING";

export type Place = {
  coordinates: {
    lat: number;
    lon: number;
  };
  address: {
    state: {
      initials: string;
      name: string;
    };
    city: string;
    postcode: string;
    street: string;
    suburb: string;
  };
  name: string;
  place_id?: string;
}