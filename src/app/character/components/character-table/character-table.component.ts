import { AfterViewInit, Component, effect, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CharacterItem } from '@character/models/character.model';
import { CharacterDetailComponent } from "../character-detail/character-detail.component";
import { CharacterService } from '@character/services/character.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { CharacterDetails } from '@character/models/character-response.model';
import { DatePipe } from '@angular/common';
import { CharacterSearchComponent } from "../character-search/character-search.component";
import { Store } from '@ngrx/store';
import { setCurrentCharacter } from 'src/app/store/character/character.actions';
import { HighlightDirective } from '@character/directives/highlight.directive';
@Component({
  selector: 'character-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CharacterDetailComponent,
    DatePipe,
    CharacterSearchComponent,
    HighlightDirective
  ],
  templateUrl: './character-table.component.html',
  styles: `
    /* Style search highlight */
    ::ng-deep .search-highlight {
        background-color: #fff9c4;
        font-weight: bold;
      }
  `
})
export class CharacterTableComponent implements AfterViewInit, OnInit {
  characterService = inject(CharacterService);
  @Input() dataSource!: MatTableDataSource<CharacterItem>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  itemCharacter = signal<CharacterDetails | null>(null);
  totalItems: number = 0;
  displayedColumns: string[] = [
    'name',
    'status',
    'species',
    'type',
    'gender',
    'created'
  ];

  nameTerm = this.characterService.nameTerm; ;

  constructor(private store: Store) {
    // Usar effect para manejar cambios en el total de personajes
    effect(() => {
      this.totalItems = this.characterService.totalCharactersValue();
      if (this.paginator) {
        this.paginator.length = this.totalItems;
      }
    });
    // Usar effect para manejar cambios en la página actual
    effect(() => {
      const currentPage = this.characterService.currentPage();
      if (this.paginator && this.paginator.pageIndex !== currentPage - 1) {
        this.paginator.pageIndex = currentPage - 1;
      }
    });
  }
  ngOnInit(): void {
    // Inicialización ya manejada por los effects
  }
  handlePageEvent(event: PageEvent): void {
    const page = event.pageIndex + 1;
    this.characterService.goToPage(page);
  }
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
      this.itemCharacter.set(resp);
      this.store.dispatch(setCurrentCharacter({ character: resp.character }));
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // Configurar el paginador con valores iniciales
    if (this.paginator) {
      this.paginator.length = this.totalItems;
    }
  }
}
