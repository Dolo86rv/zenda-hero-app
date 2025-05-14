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
import { addFavorite, removeFavorite } from 'src/app/store/character/character.actions';
import { Observable, take } from 'rxjs';
import { selectFavorites } from 'src/app/store/character/character.selectors';
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
  character = input.required<CharacterDetails | null>();
  characterService = inject(CharacterService);

  characterLocation = signal<LocationDetail | null>(null);
  characterEpisode = signal<Episode | null>(null);
  characterOrigin = signal<LocationDetail | null>(null);
  favorite$: Observable<Character[] | null>;
  listFavorite = signal<Character[]>([]);

  isFavorite = computed(() => {
    if (this.character()?.character) {
      return this.listFavorite().some((item) => item.id === this.character()?.character?.id) || false;
    }
    return false;
  })

  constructor(private store: Store) {
    this.favorite$ = this.store.select(selectFavorites)

    this.favorite$.subscribe((data) => {
      this.listFavorite.set(data || []);
    });
  }

  toggledFavorites(character: Character): void {
    this.favorite$.pipe(take(1)).subscribe((data) => {
      const isFavorite = data?.some((item) => item.id === character.id);

      if (isFavorite) {
        this.removeFavorite(character);
      } else {
        this.addToFavorites(character);
      }
    });
  }

  addToFavorites(character: Character ) {
    this.store.dispatch(addFavorite({ character }));

  }

  removeFavorite(character: Character): void {
    const id = character.id;
    this.store.dispatch(removeFavorite({ id }));

  }



}
