import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule} from '@angular/forms';
import { CharacterService } from '@character/services/character.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterFilterComponent } from "../character-filter/character-filter.component";
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
        //takeUntilDestroyed(),
        debounceTime(500), // Espera 300ms después de que el usuario deja de escribir
        map(val => ({
          name: (val.name ?? '').trim().toLowerCase(),
          type: val.type ?? ''
        })),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), // Solo si el objeto cambió
        filter(val => !!val.name || !!val.type) // Opcional: solo si hay algún filtro activo
      ).subscribe(val => {
        // Aplica los filtros solo si cambió el valor
        this.nameTerm.set(val.name);
        this.statusTerm.set(val.type === 'allValue' ? '' : val.type);
        this.characterService.applyFilter();
      });
  }

  applyFilterByName(value: string | null) {
    if (!value) {
      this.nameTerm.set('');
      this.previewName.set('');
      this.characterService.applyFilter();
      return;
    }

    if(this.previewName() === value) {
      return;
    }

    this.nameTerm.set(value.trim().toLowerCase());
    this.previewName.set(value.trim().toLowerCase());
    this.characterService.applyFilter();
  }

  clearFilters() {
    this.nameTerm.set('');
    this.statusTerm.set('');
    this.characterService.applyFilter();
  }

  applyFilterByStatus(value: string | null) {
    if (!value || value === 'allValue') {
      this.statusTerm.set('');
      this.characterService.applyFilter();
      return;
    }

    if (value === 'allValue') {
      this.statusTerm.set('');
      this.characterService.applyFilter();
      return;
    }
    this.statusTerm.set(value);
    this.characterService.applyFilter();
  }

}
