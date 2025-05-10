import { Routes } from '@angular/router';
import { HomePageComponent } from './store-front/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'characters',
    loadChildren: () => import('./character/character.routes'),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
