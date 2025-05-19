import { Episode } from "./episode.model";
import { LocationDetail } from "./location.model";


export interface CharacterResponse {
  info:    PaginationInfo;
  results: Character[];
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next:  string | null;
  prev:  string | null;
}

export interface Character {
  id:       number;
  name:     string;
  status:   Status;
  species:  Species;
  type:     string;
  gender:   Gender;
  origin:   Location;
  location: Location;
  image:    string;
  episode:  string[];
  url:      string;
  created:  Date;
}
export interface CharacterDetails {
  character: Character | null;
  origin: LocationDetail | null;
  location: LocationDetail | null;
  firstEpisode: Episode | null;
  originResidents: Character | null;
  locationResidents: Character | null;
}

export enum Gender {
  Female = "Female",
  Male = "Male",
  Unknown = "unknown",
}

export interface Location {
  name: string;
  url:  string;
}

export enum Species {
  Alien = "Alien",
  Human = "Human",
}

export enum Status {
  Alive = "Alive",
  Dead = "Dead",
  Unknown = "Unknown",
}

export interface CharacterFilter {
  name?: string;
  type?: string;
  status?: string;
  species?: string;
  gender?: string;
}


