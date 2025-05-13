import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Gender, Species, Status, type CharacterResponse } from '../interfaces/character.response.interface';
import { catchError, Observable, of, tap } from 'rxjs';
import { CharacterMapper } from '@character/mappers/character.mapper';
import { CharacterItem } from '@character/interfaces/character.interface';
import { Episode } from '@character/interfaces/episode.interface';
import { LocationDetail } from '@character/interfaces/location.interface';

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
  private charactersPage = signal(0);
  charactersLoading = signal(false);
  characters = signal<CharacterItem[]>([]);

  constructor() {
    this.getCharacters();
  }

  charactersArray = computed(() => this.characters());

  getCharacters(){
    this.http.get<CharacterResponse>(`${API_URL}/character`).subscribe((resp) => {
      const items = CharacterMapper.mapCharacterItems(resp.results);
      this.characters.set(items);
      console.log({items})
    });
  }
  getEpisode(baseUrl: string): Observable<Episode> {
    if (!baseUrl) return of({} as Episode);

    return this.http.get<Episode>(baseUrl).pipe(
      tap((resp) => console.log(`Fetched episode: ${resp.name}`)),
    );
  }

  getLocation(baseUrl: string): Observable<LocationDetail> {
    if (!baseUrl) return of({} as LocationDetail);

    return this.http.get<LocationDetail>(baseUrl).pipe(
      tap((resp) => console.log(`Fetched location: ${resp.name}`)),
    );
  }

  getResidents(residents: string[]): Observable<CharacterItem> {
    if (residents.length <= 0) return of({} as CharacterItem);
    const baseUrl = residents[0]; 
    return this.http.get<CharacterItem>(baseUrl).pipe(
      tap((resp) => console.log(`Fetched location: ${resp.name}`)),
    );
  }
}
