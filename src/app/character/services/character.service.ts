import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Gender, Species, Status, type CharacterResponse } from '../models/character-response.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CharacterMapper } from '@character/mappers/character.mapper';
import { CharacterItem } from '@character/models/character.model';
import { Episode } from '@character/models/episode.model';
import { LocationDetail } from '@character/models/location.model';
const API_URL = environment.baseUrl;
const emptyCharacter: CharacterItem = {
    id: 0,
    name: '',
    status: Status.Unknown,
    species:  Species.Human,
    type: '',
    gender: Gender.Male,
    created:  new Date(),
    origin:   {name: '', url: ''},
    location: {name: '', url: ''},
    image: '',
    episode: [],
    url: '',
}
@Injectable({providedIn: 'root'})
export class CharacterService {
  private http = inject(HttpClient);
  private charactersPage = signal(1); // Comenzamos en la página 1
  charactersLoading = signal(false);
  characters = signal<CharacterItem[]>([]);
  totalPages = signal(0);
  totalCharacters = signal(0);
  constructor() {
    this.getCharacters();
  }
  charactersArray = computed(() => this.characters());
  currentPage = computed(() => this.charactersPage());
  totalPagesValue = computed(() => this.totalPages());
  totalCharactersValue = computed(() => this.totalCharacters());
  getCharacters(page: number = 1): void {
    this.charactersLoading.set(true);
    this.charactersPage.set(page);
    this.http.get<CharacterResponse>(`${API_URL}/character?page=${page}`).pipe(
      tap(resp => {
        if (resp.info) {
          this.totalPages.set(resp.info.pages);
          this.totalCharacters.set(resp.info.count);
        }
      }),
      catchError(error => {
        console.error('Error fetching characters:', error);
        return of({ results: [], info: { count: 0, pages: 0, next: null, prev: null } } as CharacterResponse);
      })
    ).subscribe((resp) => {
      const items = CharacterMapper.mapCharacterItems(resp.results);
      this.characters.set(items);
      this.charactersLoading.set(false);
      console.log({items, pageInfo: resp.info});
    });
  }
  nextPage(): void {
    const currentPage = this.charactersPage();
    if (currentPage < this.totalPages()) {
      this.getCharacters(currentPage + 1);
    }
  }
  prevPage(): void {
    const currentPage = this.charactersPage();
    if (currentPage > 1) {
      this.getCharacters(currentPage - 1);
    }
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.getCharacters(page);
    }
  }
  getEpisode(baseUrl: string): Observable<Episode> {
    if (!baseUrl) return of({} as Episode);
    return this.http.get<Episode>(baseUrl).pipe(
      tap((resp) => console.log(`episode: ${resp.name}`)),
    );
  }
  getLocation(baseUrl: string): Observable<LocationDetail> {
    if (!baseUrl) return of({} as LocationDetail);
    return this.http.get<LocationDetail>(baseUrl).pipe(
      tap((resp) => console.log(`location: ${resp.name}`)),
    );
  }
  getResidents(residents: string[]): Observable<CharacterItem> {
    if (residents.length <= 0) return of({} as CharacterItem);
    const baseUrl = residents[0];
    return this.http.get<CharacterItem>(baseUrl).pipe(
      tap((resp) => console.log(`location: ${resp.name}`)),
    );
  }
  getCharacterByQuery(query: string): void {
    this.charactersLoading.set(true);
    this.http.get<CharacterResponse>(`${API_URL}/character/?${query}`).pipe(
      tap(resp => {
        if (resp.info) {
          this.totalPages.set(resp.info.pages);
          this.totalCharacters.set(resp.info.count);
        }
      }),
      catchError(error => {
        console.error('Error fetching characters with query:', error);
        this.characters.set([]);
        this.totalPages.set(0);
        this.totalCharacters.set(0);
        this.charactersLoading.set(false);
        return of({ results: [], info: { count: 0, pages: 0, next: null, prev: null } } as CharacterResponse);
      })
    ).subscribe((resp) => {
      const items = CharacterMapper.mapCharacterItems(resp.results);
      this.characters.set(items);
      this.charactersLoading.set(false);
      console.log({items})
    });
  }
}
