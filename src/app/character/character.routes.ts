import { Routes } from "@angular/router";
import { CharacterLayoutComponent } from "./layouts/character-layout/character-layout.component";
import { CharactersPageComponent } from "./pages/characters-page/characters-page.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";

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
        path: 'search',
        component: SearchPageComponent
      },
      {
        path: '**',
        redirectTo: 'characters'
      }
    ]
  }
]

export default characterRoutes;
