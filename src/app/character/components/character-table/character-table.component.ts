import { AfterViewInit, Component, inject, Input, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { CharacterItem } from '@character/models/character.model';
import { CharacterDetailComponent } from "../character-detail/character-detail.component";
import { CharacterService } from '@character/services/character.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { CharacterDetails } from '@character/models/character-response.model';
import { DatePipe } from '@angular/common';
import { CharacterSearchComponent } from "../character-search/character-search.component";
import { Store } from '@ngrx/store';
import { setCurrentCharacter } from 'src/app/store/character/character.actions';

@Component({
  selector: 'character-table',
  imports: [MatTableModule, MatPaginatorModule, CharacterDetailComponent, DatePipe, CharacterSearchComponent],
  templateUrl: './character-table.component.html',
})
export class CharacterTableComponent implements AfterViewInit{
  characterService = inject(CharacterService);

  @Input() dataSource!: MatTableDataSource<CharacterItem>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  itemCharacter?: CharacterDetails;

  displayedColumns: string[] = [
    'name',
    'status',
    'species',
    'type',
    'gender',
    'created'
  ];

  constructor(private store: Store){ }

  selectCharacter(character: CharacterItem): void{
    const originUrl = character.origin?.url ? this.characterService.getLocation(character.origin.url) : of(null);
    const locationUrl = character.location?.url ? this.characterService.getLocation(character.location.url) : of(null);
    const episodeUrl = character.episode && character.episode.length > 0 ? this.characterService.getEpisode(character.episode[0]) : of(null);

    forkJoin({
      origin: originUrl,
      location: locationUrl,
      firstEpisode: episodeUrl,
    }).pipe(
      switchMap(({ origin, location, firstEpisode }) => {
        const originResidents$ = origin ? this.characterService.getResidents(origin.residents) : of(null);
        const locationResidents$ = location ? this.characterService.getResidents(location.residents) : of(null);

        return forkJoin({
          originResidents: originResidents$,
          locationResidents: locationResidents$
        }).pipe(
          map(({ originResidents, locationResidents }) => {
            return {
              character,
              origin,
              location,
              firstEpisode,
              originResidents,
              locationResidents,
            }
          })
        );
      })
    ).subscribe((resp) => {
      this.itemCharacter = resp;
      this.store.dispatch(setCurrentCharacter({ character: resp.character }));
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource.paginator);
  }

}
