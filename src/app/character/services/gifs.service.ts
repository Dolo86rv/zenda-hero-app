import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Gif } from '@character/interfaces/gif.interface';
import { GiphyResponse } from '@character/interfaces/giphy.interface';
import { GifMapper } from '@character/mappers/gif.mapper';
import { environment } from 'src/environments/environment';

const API_URL = environment.gifsUrl;

@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

  gifsArray = computed(() => this.trendingGifs());

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${API_URL}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '10',
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItems(resp.data);
      this.trendingGifs.set(gifs);
      console.log({gifs})
    })
  }

}
