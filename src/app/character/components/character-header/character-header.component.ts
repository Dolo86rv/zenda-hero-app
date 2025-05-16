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
  imports: [MatIconModule, MatCardModule],
  templateUrl: './character-header.component.html',
})
export class CharacterHeaderComponent {
  private favoriteCharacter = signal<Character | null>(null);
  characterFavorite = computed(() => this.favoriteCharacter()?.name);

  constructor(private store: Store) {
    this.store.select(selectFavorites).subscribe(character => {
      this.favoriteCharacter.set(character);
    });
  }

}
