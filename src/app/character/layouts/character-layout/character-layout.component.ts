import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterHeaderComponent } from '@character/components/character-header/character-header.component';

@Component({
  selector: 'app-character-layout',
  imports: [RouterOutlet, CharacterHeaderComponent],
  templateUrl: './character-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterLayoutComponent { }
