import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'character-header',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './character-header.component.html',
})
export class CharacterHeaderComponent { }
