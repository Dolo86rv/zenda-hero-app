import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-character-page',
  imports: [],
  templateUrl: './character-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterPageComponent { }
