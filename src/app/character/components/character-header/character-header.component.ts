import { Component, computed } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { map, Observable, tap } from 'rxjs';
import { Character } from '@character/models/character-response.model';
import { Store } from '@ngrx/store';
import { selectFavorites } from 'src/app/store/character/character.selectors';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'character-header',
  imports: [MatIconModule, MatCardModule, AsyncPipe],
  templateUrl: './character-header.component.html',
})
export class CharacterHeaderComponent {
  favorite$: Observable<Character[] | null>;




  constructor(private store: Store) {
    this.favorite$ = this.store.select(selectFavorites)

    this.favorite$.pipe(tap((data) => console.log('data', data)))
    .subscribe()
  }




}
