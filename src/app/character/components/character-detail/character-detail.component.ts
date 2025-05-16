import { Store } from '@ngrx/store';
import { Component, inject, input, signal, computed } from '@angular/core';
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
import { removeFavorite, setFavorite } from 'src/app/store/character/character.actions';
import { Observable, take, tap } from 'rxjs';
import { selectDetail, selectFavorites } from 'src/app/store/character/character.selectors';
import { TruncatePipe } from '@character/pipes/truncate.pipe';


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
    TruncatePipe
  ],
  templateUrl: './character-detail.component.html',

})
export class CharacterDetailComponent {
  characterService = inject(CharacterService);

  characterLocation = signal<LocationDetail | null>(null);
  characterEpisode = signal<Episode | null>(null);
  characterOrigin = signal<LocationDetail | null>(null);
  characterFavorite = signal<CharacterDetails | null>(null);
  character = signal<CharacterDetails | null>(null);

  isFavorite = signal<boolean>(false);

  constructor(private store: Store) {
    this.store.select(selectFavorites).subscribe((character) => {
      this.characterFavorite.set(character);
    });

    this.store.select(selectDetail).subscribe((character) => {
      this.character.set(character);
    });
  }

  toggledFavorites(character: CharacterDetails | null): void {
    console.log('toggledFavorites', character);
    this.store.dispatch(setFavorite({ character }))




    //if( this.characterFavorite() === null) {
    //  const result = this.store.dispatch(setFavorite({ character }));
    //  this.isFavorite.set(true);
    //  this.characterFavorite.set(character);
    //  console.log('setFavorite', result);
    //  return;
    //}else {
    //  this.store.dispatch(removeFavorite());
    //  this.isFavorite.set(false);
    //}

  }
}
