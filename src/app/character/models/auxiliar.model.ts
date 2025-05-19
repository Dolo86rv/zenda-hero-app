export interface SpeciesCount {
  species: string;
  count: number;
}
export interface TypeCount {
  type: string;
  count: number;
}

export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}
export interface GraphQLVariables {
  page?: number;
  filter: CharacterFilter;
}

export interface GraphQLResponse {
  data?: {
    characters?: {
      info?: {
        count: number;
        pages: number;
      };
      results?: Array<{
        species?: string;
        type?: string;
      }>;
    };
  };
}

export interface Filter {
  name: string;
  type: string;
}
export interface Status {
  value: string;
  viewValue: string;
}

export enum Color {
  red,
  black,
  green,
  blue,
}

export const ColorMap = {
  red: 'red',
  green: 'green',
  black: 'gray',
}
