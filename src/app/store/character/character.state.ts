import { Character, CharacterDetails } from "@character/models/character-response.model";

export interface CharacterState {
  favorite: CharacterDetails | null;
  detail: CharacterDetails | null;
}

export const initialState: CharacterState = {
  favorite: null,
  detail: null,
}
