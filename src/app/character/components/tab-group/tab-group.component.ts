import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TabStatisticsService } from '@character/services/tab-statistics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'tab-count',
  standalone: true,
  imports: [MatTabsModule, CommonModule, MatProgressSpinnerModule, KeyValuePipe],
  templateUrl: './tab-group.component.html',
  styles:
  `
    .mat-tab-label.mat-tab-label-active {
      @apply bg-blue-500 text-white rounded-t-lg shadow;
    }
  `
})
export class TabCountComponent {
  // Inyectamos el servicio de estadísticas con GraphQL
  private statsService = inject(TabStatisticsService);
  // Propiedades computadas para la vista
  speciesCount = this.statsService.speciesCount;
  typeCount = this.statsService.typeCount;
  totalSpecies = this.statsService.totalSpecies;
  totalTypes = this.statsService.totalTypes;
  isLoading = this.statsService.isLoading;
}
