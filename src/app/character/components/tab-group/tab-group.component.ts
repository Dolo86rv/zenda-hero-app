import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'tab-count',
  imports: [MatTabsModule],
  templateUrl: './tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabCountComponent { }
