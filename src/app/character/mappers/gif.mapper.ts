import { Gif } from "@character/models/gif.interface";
import { GiphyItem } from "@character/models/giphy.interface";

export class GifMapper {
  static mapGiphyItem(item: GiphyItem):  Gif{
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    }
  }

  static mapGiphyItems(items: GiphyItem[]): Gif[]{
    return items.map(this.mapGiphyItem);
  }
}
