import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'profile',
  imports: [],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent { }
