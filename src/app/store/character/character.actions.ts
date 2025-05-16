import { createAction, props } from '@ngrx/store';
import { Character, CharacterDetails } from '@character/models/character-response.model';


export const setFavorite = createAction(
  '[CharacterItem] Add Favorite',
  props<{ character: CharacterDetails | null}>()
);

export const removeFavorite = createAction(
  '[Character] Remove Favorite'
);

export const setDetail = createAction(
  '[Character] Add Detail',
  props<{ character: CharacterDetails | null}>()
);


