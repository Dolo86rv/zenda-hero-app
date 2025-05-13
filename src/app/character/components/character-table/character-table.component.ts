import { AfterViewInit, Component, effect, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
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
export class CharacterTableComponent implements AfterViewInit, OnInit {
  characterService = inject(CharacterService);
  @Input() dataSource!: MatTableDataSource<CharacterItem>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  itemCharacter?: CharacterDetails;
  totalItems: number = 0;
  currentPageSize: number = 20;
  displayedColumns: string[] = [
    'name',
    'status',
    'species',
    'type',
    'gender',
    'created'
  ];
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
    //Usar effect para manejar cambios en el tamaño de página
    effect(() => {
      this.currentPageSize = this.characterService.currentPageSize();
      if (this.paginator && this.paginator.pageSize !== this.currentPageSize) {
        this.paginator.pageSize = this.currentPageSize;
      }
    });
  }
  ngOnInit(): void {
    // Inicialización ya manejada por los effects
  }
  handlePageEvent(event: PageEvent): void {
    console.log('PageEvent:', event);
    const page = event.pageIndex + 1;
    const pageSize = event.pageSize;
    // Si cambió el tamaño de la página
    if (pageSize !== this.currentPageSize) {
      this.characterService.setPageSize(pageSize);
    } else {
      // Si solo cambió el número de página
      this.characterService.goToPage(page, pageSize);
    }
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
      this.itemCharacter = resp;
      this.store.dispatch(setCurrentCharacter({ character: resp.character }));
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // Configurar el paginador con valores iniciales
    if (this.paginator) {
      this.paginator.length = this.totalItems;
      this.paginator.pageSize = this.currentPageSize;
    }
    console.log('Paginator:', this.dataSource.paginator);
  }
}
