import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Gif } from '@character/interfaces/gif.interface';
import { LocationDetail } from '../../interfaces/location.interface';
import { CharacterService } from '@character/services/character.service';
import { Episode } from '@character/interfaces/episode.interface';
import { CharacterDetails } from '@character/interfaces/character.response.interface';

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





}
