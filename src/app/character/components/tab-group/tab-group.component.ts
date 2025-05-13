import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CharacterService } from '@character/services/character.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'tab-count',
  standalone: true,
  imports: [MatTabsModule, CommonModule],
  templateUrl: './tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabCountComponent {
  private characterService = inject(CharacterService);
  // Obtenemos los personajes del servicio
  characters = computed(() => this.characterService.charactersArray());
  // Contamos especies únicas y sus totales
  speciesCount = computed(() => {
    const characters = this.characters();
    const speciesMap = new Map<string, number>();
    characters.forEach(character => {
      const species = character.species || 'Unknown';
      const currentCount = speciesMap.get(species) || 0;
      speciesMap.set(species, currentCount + 1);
    });
    return Array.from(speciesMap).map(([species, count]) => ({ species, count }));
  });
  // Contamos tipos únicos y sus totales
  typeCount = computed(() => {
    const characters = this.characters();
    const typeMap = new Map<string, number>();
    characters.forEach(character => {
      const type = character.type || 'Unknown';
      const currentCount = typeMap.get(type) || 0;
      typeMap.set(type, currentCount + 1);
    });
    return Array.from(typeMap).map(([type, count]) => ({ type, count }));
  });
  // Total de especies diferentes
  totalSpecies = computed(() => this.speciesCount().length);
  // Total de tipos diferentes
  totalTypes = computed(() => this.typeCount().length);
}
