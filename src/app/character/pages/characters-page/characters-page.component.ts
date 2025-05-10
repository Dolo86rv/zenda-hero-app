import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-characters-page',
  imports: [],
  templateUrl: './characters-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent {

  charactersService = inject(CharacterService);

}
