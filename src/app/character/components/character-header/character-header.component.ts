import { Component, computed, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { map, Observable, tap } from 'rxjs';
import { Character } from '@character/models/character-response.model';
import { Store } from '@ngrx/store';
import { selectFavorites, selectSelectedCharacter } from 'src/app/store/character/character.selectors';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'character-header',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './character-header.component.html',
})
export class CharacterHeaderComponent {
  favorite$: Observable<Character[] | null>;
  currentCharacter$: Observable<Character | null>;
  listFavorite = signal<Character[]>([]);
  selectedCharacter = signal<Character | null>(null);

  isFavorite = computed(() => {
    if (this.selectedCharacter()) {
      return this.listFavorite().some((item) => item.id === this.selectedCharacter()?.id) || false;
    }
    return false;
  })

  constructor(private store: Store) {
    this.favorite$ = this.store.select(selectFavorites)
    this.currentCharacter$ = this.store.select(selectSelectedCharacter)

    this.favorite$.subscribe((data) => {
      this.listFavorite.set(data || []);
    });

    this.currentCharacter$.subscribe((data) => {
      this.selectedCharacter.set( data );
    });
  }






}
