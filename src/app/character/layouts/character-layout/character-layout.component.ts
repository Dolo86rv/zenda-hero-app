import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '@character/components/side-menu/side-menu.component';

@Component({
  selector: 'app-character-layout',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './character-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterLayoutComponent { }
