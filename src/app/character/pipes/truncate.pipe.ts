
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Transform a string by truncating it to the specified length and adding ellipsis.
   *
   * @param value - The string to truncate
   * @param limit - The maximum length (default: 100)
   * @param suffix - Optional suffix to add after ellipsis (default: '')
   * @returns The truncated string with ellipsis and optional suffix
   */
  transform(value: string | undefined, limit: number = 100, suffix: string = ''): string {
    if (!value) {
      return '' ;
    }

    if (value.length <= limit) {
      return value;
    }

    const truncated = value.substring(0, limit).trim();
    return `${truncated}...${suffix}`;
  }
}
