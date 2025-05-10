import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import type { Character } from '../interfaces/character.response.interface';

const API_URL = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class CharacterService {

  private http = inject(HttpClient);
  loadCharacter() {

    this.http.get<Character>(`${API_URL}/character`).subscribe((resp) => {
      console.log({resp});
    })

  }

}
