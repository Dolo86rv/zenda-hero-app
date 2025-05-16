import { createReducer, on } from "@ngrx/store";
import { initialState } from "./character.state";
import { removeFavorite, setDetail, setFavorite } from "./character.actions";

export const characterReducer = createReducer(
  initialState,

  on(setFavorite, (state, { character })  => ({
    ...state,
    favorite: character,
  })),

  on(removeFavorite, (state) => ({
    ...state,
    favorite: null,
  })),

  on(setDetail, (state, { character })  => ({
    ...state,
    detail: character,
  })),


);
