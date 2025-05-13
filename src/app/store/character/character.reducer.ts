import { createReducer, on } from "@ngrx/store";
import { initialState } from "./character.state";
import { selectCharacter, addFavorite, removeFavorite, setCurrentCharacter } from "./character.actions";

export const characterReducer = createReducer(
  initialState,

  on(selectCharacter, (state, { character }) => ({
    ...state,
    selectedCharacter: character,
  })),

  on(addFavorite, (state, { character }) => {
    const alreadyFavorite = state.favorite.some(fav => fav.id === character.id);
    return alreadyFavorite
      ? state // si ya está, no lo añade
      : {
          ...state,
          favorite: [...state.favorite, character]
        };
  }),

  on(removeFavorite, (state, { id }) => ({
    ...state,
    favorite: state.favorite.filter((character) => character.id !== id),
  })),

  on(setCurrentCharacter, (state, { character }) => ({
    ...state,
    selectedCharacter: character,
  }))

);
