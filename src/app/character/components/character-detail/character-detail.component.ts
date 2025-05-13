import { Store } from '@ngrx/store';
import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CharacterService } from '@character/services/character.service';
import { Episode } from '@character/models/episode.model';
import { Character, CharacterDetails } from '@character/models/character-response.model';


import { LocationDetail } from '@character/models/location.model';
import { addFavorite } from 'src/app/store/character/character.actions';


@Component({
  selector: 'character-detail',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './character-detail.component.html',

})
export class CharacterDetailComponent {
  //gif = input.required<Gif>();
  character = input.required<CharacterDetails | undefined>();
  characterService = inject(CharacterService);

  characterLocation = signal<LocationDetail | null>(null);
  characterEpisode = signal<Episode | null>(null);
  characterOrigin = signal<LocationDetail | null>(null);

  constructor(private store: Store) {}

  addToFavorites(character: Character ) {
    this.store.dispatch(addFavorite({ character }));
  }

  /*removeFavorite(character: Character): void {
    const { id: number} = character;
    this.store.dispatch(this.removeFavorite({ id }));
  }*/



}
