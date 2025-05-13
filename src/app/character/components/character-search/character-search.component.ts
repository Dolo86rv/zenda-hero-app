import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import { CharacterService } from '@character/services/character.service';
import { Character } from '@character/models/character-response.model';


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
    MatSelectModule
  ],
  templateUrl: './character-search.component.html',

})
export class CharacterSearchComponent {
  characterService = inject(CharacterService);

  nameTerm = signal<string>('');
  statusTerm = signal<string>('');
  query = computed(() => {
    if (!this.nameTerm() && !this.statusTerm()) return '';
    if (this.nameTerm() && !this.statusTerm()) return `?name=${this.nameTerm()}`;
    if (!this.nameTerm() && this.statusTerm()) return `?status=${this.statusTerm()}`;
    return `?name=${this.nameTerm()}&status=${this.statusTerm()}`;
  })

  estados = signal<Status[]>([
    {value: 'alive', viewValue: 'Alive'},
    {value: 'dead', viewValue: 'Dead'},
    {value: 'unknown', viewValue: 'Unknown'},
  ]);


  applyFilterByName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.nameTerm.set(filterValue);
    this.characterService.getCharacterByQuery(this.query());
  }

  applyFilterByStatus(value: string) {
    this.statusTerm.set(value);
    this.characterService.getCharacterByQuery(this.query());
  }
}
