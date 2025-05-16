import { createReducer, on } from "@ngrx/store";
import { initialState } from "./character.state";
import { selectCharacter, removeFavorite, setCurrentCharacter, setFavorite } from "./character.actions";

export const characterReducer = createReducer(
  initialState,

  on(selectCharacter, (state, { character }) => ({
    ...state,
    selectedCharacter: character,
  })),

  on(setFavorite, (state, { character })  => ({
    ...state,
    favorite: character,
  })),

  on(removeFavorite, (state) => ({
    ...state,
    favorite: null,
  })),

  on(setCurrentCharacter, (state, { character }) => ({
    ...state,
    selectedCharacter: character,
  }))

);
