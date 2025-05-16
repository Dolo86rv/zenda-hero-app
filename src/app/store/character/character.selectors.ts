import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CharacterState } from './character.state';

export const selectCharacterState = createFeatureSelector<CharacterState>('character');

export const selectFavorites = createSelector(
  selectCharacterState,
  (state) => state.favorite
);

export const selectDetail = createSelector(
  selectCharacterState,
  (state) => state.detail
);
