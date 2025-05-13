import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { TabStatisticsService } from '@character/services/tab-statistics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'tab-count',
  standalone: true,
  imports: [MatTabsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
