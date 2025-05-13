import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CharacterState } from './character.state';

export const selectCharacterState = createFeatureSelector<CharacterState>('character');

export const selectSelectedCharacter = createSelector(
  selectCharacterState,
  (state) => state.selectedCharacter
);

export const selectFavorites = createSelector(
  selectCharacterState,
  (state) => state.favorite
);
