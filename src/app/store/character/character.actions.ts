import { createAction, props } from '@ngrx/store';
import { Character } from '@character/models/character-response.model';


export const selectCharacter = createAction(
  '[CharacterItem] Select CharacterItem',
  props<{ character: Character }>()
);

export const setFavorite = createAction(
  '[CharacterItem] Add Favorite',
  props<{ character: Character | null}>()
);

export const removeFavorite = createAction(
  '[Character] Remove Favorite'
);

export const setCurrentCharacter = createAction(
  '[Character] Set Current Character',
  props<{ character: Character }>()
);
