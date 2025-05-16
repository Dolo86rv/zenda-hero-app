import { Component, computed, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { map, Observable, tap } from 'rxjs';
import { Character } from '@character/models/character-response.model';
import { Store } from '@ngrx/store';
import { selectFavorites } from 'src/app/store/character/character.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'character-header',
  imports: [MatIconModule, MatCardModule, AsyncPipe],
  templateUrl: './character-header.component.html',
})
export class CharacterHeaderComponent {
  favorite$: Observable<Character | null>;
  characterFavorite = computed(() => this.favorite$.subscribe(
    (character) => {
      console.log('characterFavorite', character);
      return character;
    }
  ));

  constructor(private store: Store) {
    console.log('CharacterHeaderComponent', this.store);
    console.log('CharacterHeader 1111', this.store.select(selectFavorites));
    this.favorite$ = this.store.select(selectFavorites)
  }




}
