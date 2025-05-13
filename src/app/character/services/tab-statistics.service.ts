import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { CharacterService } from './character.service';
import { HttpClient } from '@angular/common/http';
// Interfaces simples para los conteos
export interface SpeciesCount {
  species: string;
  count: number;
}
export interface TypeCount {
  type: string;
  count: number;
}
// Interfaces para GraphQL
interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}
interface GraphQLVariables {
  page?: number;
  filter: CharacterFilter;
}
interface GraphQLResponse {
  data?: {
    characters?: {
      info?: {
        count: number;
        pages: number;
      };
      results?: Array<{
        species?: string;
        type?: string;
      }>;
    };
  };
}
@Injectable({
  providedIn: 'root'
})
export class TabStatisticsService {
  private characterService = inject(CharacterService);
  private http = inject(HttpClient);
  // Datos de estadísticas
  private speciesCountData = signal<SpeciesCount[]>([]);
  private typeCountData = signal<TypeCount[]>([]);
  private loading = signal<boolean>(false);
  // Propiedades computadas para los componentes
  speciesCount = computed(() => this.speciesCountData());
  typeCount = computed(() => this.typeCountData());
  totalSpecies = computed(() => this.speciesCount().length);
  totalTypes = computed(() => this.typeCount().length);
  isLoading = computed(() => this.loading());
  // Signal para los personajes de la página actual
  private currentCharacters = signal<any[]>([]);
  constructor() {
    // Efecto para actualizar las estadísticas cuando cambia la página o filtros
    effect(() => {
      // Observamos los cambios en la página, tamaño de página, y filtros
      const characters = this.characterService.charactersArray();
      const currentPage = this.characterService.currentPage();
      const pageSize = this.characterService.currentPageSize();
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
    // Si no hay personajes, no hacemos nada
    const characters = this.currentCharacters();
    if (!characters || characters.length === 0) {
      return;
    }
    // Calcular estadísticas de especies
    const speciesMap = new Map<string, number>();
    characters.forEach(character => {
      const species = character.species || 'Unknown';
      speciesMap.set(species, (speciesMap.get(species) || 0) + 1);
    });
    // Calcular estadísticas de tipos
    const typeMap = new Map<string, number>();
    characters.forEach(character => {
      const type = character.type || 'Unknown';
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });
    // Actualizar los datos
    this.speciesCountData.set(
      Array.from(speciesMap).map(([species, count]) => ({ species, count }))
    );
    this.typeCountData.set(
      Array.from(typeMap).map(([type, count]) => ({ type, count }))
    );
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
    const pageSize = this.characterService.currentPageSize();
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
    // Realizar la petición GraphQL
    this.http.post<GraphQLResponse>('https://rickandmortyapi.com/graphql', {
      query,
      variables
    }).subscribe({
      next: (response: GraphQLResponse) => {
        const allCharacters = response?.data?.characters?.results || [];
        // Aplicar el tamaño de página actual (igual que en la UI)
        // Si la API devuelve 20 pero la UI muestra 5, tomamos solo los primeros 5
        const visibleCharacters = allCharacters.slice(0, pageSize);
        // Actualizar los personajes actuales
        this.currentCharacters.set(visibleCharacters);
        // Calcular estadísticas con los personajes visibles
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
