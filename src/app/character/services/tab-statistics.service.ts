import { Injectable, inject, signal, computed } from '@angular/core';
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
  filter: CharacterFilter;
}
interface GraphQLResponse {
  data?: {
    characters?: {
      info?: {
        count: number;
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
  constructor() {
    // Carga inicial de datos
    this.fetchStatistics();
  }
  fetchStatistics() {
    this.loading.set(true);
    // Obtener los términos de búsqueda del servicio existente
    const nameTerm = this.characterService.nameTerm();
    const statusTerm = this.characterService.statusTerm();
    // Construir las variables para la consulta GraphQL
    const variables: GraphQLVariables = {
      filter: {}
    };
    if (nameTerm) {
      variables.filter.name = nameTerm;
    }
    if (statusTerm) {
      variables.filter.status = statusTerm;
    }
    // Consulta GraphQL para obtener todos los personajes (sin paginación para estadísticas completas)
    const query = `
      query GetCharactersStatistics($filter: FilterCharacter) {
        characters(filter: $filter) {
          info {
            count
          }
          results {
            species
            type
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
        const characters = response?.data?.characters?.results || [];
        // Calcular estadísticas de especies
        const speciesMap = new Map<string, number>();
        characters.forEach(char => {
          const species = char.species || 'Unknown';
          speciesMap.set(species, (speciesMap.get(species) || 0) + 1);
        });
        // Calcular estadísticas de tipos
        const typeMap = new Map<string, number>();
        characters.forEach(char => {
          const type = char.type || 'Unknown';
          typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        // Actualizar los datos
        this.speciesCountData.set(
          Array.from(speciesMap).map(([species, count]) => ({ species, count }))
        );
        this.typeCountData.set(
          Array.from(typeMap).map(([type, count]) => ({ type, count }))
        );
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
  // Método para actualizar manualmente las estadísticas
  refresh() {
    this.fetchStatistics();
  }
}
