import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { CharacterService } from './character.service';
import { HttpClient } from '@angular/common/http';
import { SpeciesCount, TypeCount } from '@character/models/auxiliar.model';
import { GraphQLResponse, GraphQLVariables } from '@character/models/auxiliar.model';
import { environment } from 'src/environments/environment.development';

const API_URL = environment.baseUrlGraphQL;

@Injectable({
  providedIn: 'root'
})

export class TabStatisticsService {
  private characterService = inject(CharacterService);
  private http = inject(HttpClient);

  // Datos de estadísticas
  private speciesData = signal<Map<string, number>>(new Map<string, number>());
  private typesData = signal<Map<string, number>>(new Map<string, number>());
  private speciesCountData = signal<SpeciesCount[]>([]);
  private typeCountData = signal<TypeCount[]>([]);
  private loading = signal<boolean>(false);

  // Propiedades computadas para los componentes
  speciesCount = computed(() => this.speciesData());
  typeCount = computed(() => this.typesData());
  totalSpecies = computed(() => this.speciesCount().size);
  totalTypes = computed(() => this.typeCount().size);
  isLoading = computed(() => this.loading());

  // Signal para los personajes de la página actual
  private currentCharacters = signal<any[]>([]);

  constructor() {
    //Actualiza las estadísticas cuando cambia la página o filtros
    effect(() => {
      const characters = this.characterService.charactersArray();
      const currentPage = this.characterService.currentPage();
      const nameTerm = this.characterService.nameTerm();
      const statusTerm = this.characterService.statusTerm();
      // Actualizamos los personajes de la página actual
      this.currentCharacters.set(characters);
      // Y calculamos estadísticas con ellos
      this.calculateStatistics();
    });
    // Carga inicial para asegurar que haya datos
    this.fetchStatistics();
  }
  calculateStatistics() {
    const characters = this.currentCharacters();
    if (!characters || characters.length === 0) {
      return;
    }
    const speciesMap = new Map<string, number>();
    const typeMap = new Map<string, number>();

    characters.forEach(({ species = 'Unknown', type = 'Unknown' }) => {
        speciesMap.set(species, (speciesMap.get(species) || 0) + 1);
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    this.speciesData.set(speciesMap);
    this.typesData.set(typeMap);
  }

  fetchStatistics() {
    // Si ya tenemos personajes en el servicio principal, usamos esos
    const characters = this.characterService.charactersArray();
    if (characters && characters.length > 0) {
      this.currentCharacters.set(characters);
      this.calculateStatistics();
      return;
    }
    // Si no tenemos personajes, hacemos fetch
    this.loading.set(true);

    // Obtener los términos de búsqueda y paginación del servicio existente
    const nameTerm = this.characterService.nameTerm();
    const statusTerm = this.characterService.statusTerm();
    const currentPage = this.characterService.currentPage();
    // Construir las variables para la consulta GraphQL
    const variables: GraphQLVariables = {
      page: currentPage,
      filter: {}
    };
    if (nameTerm) {
      variables.filter.name = nameTerm;
    }
    if (statusTerm) {
      variables.filter.status = statusTerm;
    }

    // Consulta GraphQL
    const query = `
      query GetCharactersStatistics($page: Int, $filter: FilterCharacter) {
        characters(page: $page, filter: $filter) {
          info {
            count
            pages
          }
          results {
            id
            name
            species
            type
            status
            gender
          }
        }
      }
    `;

    /*** Realizar la petición GraphQL **/
    this.http.post<GraphQLResponse>(`${API_URL}`, {
      query,
      variables
    }).subscribe({
      next: (response: GraphQLResponse) => {
        const allCharacters = response?.data?.characters?.results || [];
        this.currentCharacters.set(allCharacters);
        this.calculateStatistics();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener estadísticas con GraphQL:', error);
        this.speciesCountData.set([]);
        this.typeCountData.set([]);
        this.loading.set(false);
      }
    });
  }
  // Método para actualizar manualmente las estadísticas si fuera necesario
  refresh() {
    this.fetchStatistics();
  }
}
