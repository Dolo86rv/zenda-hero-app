import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {FormsModule} from '@angular/forms';

interface Filter {
  name: string;
  type: string;
}
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'character-search',
  imports: [
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './character-search.component.html',
  styles:`
    ::ng-deep .types-select-panel {
        z-index: 9999 !important; /* Very high z-index */
        background-color: white !important;
        position: relative !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
        max-height: 300px !important;
        overflow-y: auto !important;
    }
    ::ng-deep .types-select-panel .mat-mdc-option {
      background-color: white !important;
      color: rgba(0, 0, 0, 0.87) !important;
      height: auto !important;
      padding: 10px !important;
      line-height: 1.5 !important;
    }

    ::ng-deep .types-select-panel .mat-mdc-option:hover {
      background-color: #f5f5f5 !important;
    }
    `
})
export class CharacterSearchComponent {
  searchTerm: string = '';
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  fb = inject(FormBuilder);
  searchForm = this.fb.group<Filter>({
    name: '',
    type: '',
  });

  onSearch(){
    
  }
}
