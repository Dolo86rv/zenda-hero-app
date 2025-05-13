import { createAction, props } from '@ngrx/store';
import { Character } from '@character/models/character-response.model';


export const selectCharacter = createAction(
  '[CharacterItem] Select CharacterItem',
  props<{ character: Character }>()
);

export const addFavorite = createAction(
  '[CharacterItem] Add Favorite',
  props<{ character: Character }>()
);

export const removeFavorite = createAction(
  '[Character] Remove Favorite',
  props<{ id: number }>()
);
