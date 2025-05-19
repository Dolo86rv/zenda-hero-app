import { Pipe, PipeTransform } from '@angular/core';
import { ColorMap } from '@character/models/auxiliar.model';
import { Gender } from '@character/models/character-response.model';

@Pipe({
  name: 'textColor',
})

export class TextColorPipe implements PipeTransform {
  transform(status: string ): any {
    console.log('status', status);
    switch (status) {
        case 'Alive':
          return ColorMap.green;
        case 'Dead':
          return ColorMap.red;
        case 'unknown':
          return ColorMap.black;
        default:
          return ColorMap.black;
    }
  }
}
