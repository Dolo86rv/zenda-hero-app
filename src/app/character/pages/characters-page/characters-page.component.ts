import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CharacterTableComponent } from '@character/components/character-table/character-table.component';
import { TabCountComponent } from '@character/components/tab-group/tab-group.component';
import { CharacterItem } from '@character/models/character.model';
import { Gif } from '@character/models/gif.interface';
import { CharacterService } from '@character/services/character.service';
import { GifService } from '@character/services/gifs.service';


@Component({
  selector: 'app-characters-page',
  imports: [
    MatTableModule,
    CharacterTableComponent,
    TabCountComponent
],
  templateUrl: './characters-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent implements AfterViewInit {

  charactersService = inject(CharacterService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  characters = computed(() => this.charactersService.charactersArray());
  dataSource = new MatTableDataSource<CharacterItem>(this.characters());


  //gifsService = inject(GifService);
  //gifs = computed(() => this.gifsService.gifsArray());
  //dataSource = new MatTableDataSource<Gif>(this.gifs());

  //constructor() {
  //  effect(() => {
  //    const gifs = this.gifs();
  //    if (gifs && gifs.length > 0) {
  //      this.dataSource.data = gifs;
  //      console.log('Gifs:', gifs);
  //    }
  //  });
  //}

  constructor() {
    effect(() => {
      const charac = this.characters();
      if (charac && charac.length > 0) {
        this.dataSource.data = charac;
        console.log('Characters:', charac);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


}
