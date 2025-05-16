import { Component, computed, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { map, Observable, tap } from 'rxjs';
import { Character, CharacterDetails } from '@character/models/character-response.model';
import { Store } from '@ngrx/store';
import { selectFavorites } from 'src/app/store/character/character.selectors';
import { AsyncPipe } from '@angular/common';
import { setDetail } from 'src/app/store/character/character.actions';

@Component({
  selector: 'character-header',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './character-header.component.html',
})
export class CharacterHeaderComponent {
  private favoriteCharacter = signal<CharacterDetails | null>(null);
  characterFavorite = computed(() => this.favoriteCharacter()?.character?.name);

  constructor(private store: Store) {
    this.store.select(selectFavorites).subscribe(character => {
      this.favoriteCharacter.set(character);
    });
  }

  loadDetail() {
    this.store.dispatch(setDetail({ character: this.favoriteCharacter() }));
  }

}
