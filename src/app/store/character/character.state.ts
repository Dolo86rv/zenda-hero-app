import { Character } from "@character/models/character-response.model";

export interface CharacterState {
  selectedCharacter: Character | null;
  favorite: Character | null;
}

export const initialState: CharacterState = {
  selectedCharacter: null,
  favorite: null,
}
