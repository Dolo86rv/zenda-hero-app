import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule} from '@angular/forms';
import { CharacterService } from '@character/services/character.service';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';


interface Filter {
  name: string;
  type: string;
}
interface Status {
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
    MatSelectModule,
    ReactiveFormsModule
],
  templateUrl: './character-search.component.html',
  styles: `
    ::ng-deep .mat-form-field-appearance-fill .mat-form-field-flex {
      background-color:rgb(255, 255, 255); /* tu color deseado */
  }`

})
export class CharacterSearchComponent implements OnInit {

  characterService = inject(CharacterService);

  nameTerm = this.characterService.nameTerm; ;
  statusTerm = this.characterService.statusTerm;
  previewName = signal<string>('');

  estados = signal<Status[]>([
    {value: 'alive', viewValue: 'Alive'},
    {value: 'dead', viewValue: 'Dead'},
    {value: 'unknown', viewValue: 'Unknown'},
  ]);

  fb = inject(FormBuilder);

  estadosFilter = signal<Status[]>([
      {value: 'allValue', viewValue: 'All Value'},
      {value: 'alive', viewValue: 'Alive'},
      {value: 'dead', viewValue: 'Dead'},
      {value: 'unknown', viewValue: 'Unknown'},
  ]);


  filterForm = this.fb.group<Filter>({
    name: '',
    type: ''
  });

  ngOnInit() {
    this.filterForm.valueChanges.pipe(
        debounceTime(500),
        map(val => ({
          name: (val.name ?? '').trim().toLowerCase(),
          type: val.type ?? ''
        })),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), // Solo si el objeto cambió
        filter(val => !!val.name || !!val.type) // Opcional: solo si hay algún filtro activo
      ).subscribe(val => {
        // Aplica los filtros solo si cambió el valor

        if( this.nameTerm() == val.name && this.statusTerm() == val.type ) return;
        console.log('Filter applied:', val);
        this.nameTerm.set(val.name);
        this.statusTerm.set(val.type === 'allValue' ? '' : val.type);
        this.characterService.applyFilter();
      });
  }

}
