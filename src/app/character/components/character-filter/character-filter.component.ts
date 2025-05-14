import { Component, inject, signal } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CharacterService } from '@character/services/character.service';
import { Status } from '@character/models/auxiliar.model';


@Component({
  selector: 'character-filter',
  imports: [
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './character-filter.component.html',
})
export class CharacterFilterComponent {
  characterService = inject(CharacterService);

  nameTerm = this.characterService.nameTerm; ;
  statusTerm = this.characterService.statusTerm;

  estados = signal<Status[]>([
    {value: 'alive', viewValue: 'Alive'},
    {value: 'dead', viewValue: 'Dead'},
    {value: 'unknown', viewValue: 'Unknown'},
  ]);

  applyFilterByStatus(value: string) {
    this.statusTerm.set(value);
    this.characterService.applyFilter();
  }

}
