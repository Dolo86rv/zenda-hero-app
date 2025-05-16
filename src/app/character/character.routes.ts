import { Routes } from "@angular/router";
import { CharacterLayoutComponent } from "./layouts/character-layout/character-layout.component";
import { CharactersPageComponent } from "./pages/characters-page/characters-page.component";

export const characterRoutes: Routes = [
  {
    path: '',
    component: CharacterLayoutComponent,
    children: [
      {
        path: 'characters',
        component: CharactersPageComponent,
      },
      {
        path: '**',
        redirectTo: 'characters'
      }
    ]
  }
]

export default characterRoutes;
