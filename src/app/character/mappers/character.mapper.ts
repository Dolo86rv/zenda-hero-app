import { CharacterItem } from "@character/models/character.model";
import { Character } from "@character/models/character-response.model";

export class CharacterMapper {
  static mapCharacterItem(item: Character):  CharacterItem{
    return {
      id: item.id,
      name: item.name,
      status: item.status,
      species: item.species,
      type: item.type,
      gender: item.gender,
      created: item.created,
      origin: item.origin,
      location: item.location ,
      image: item.image,
      episode: item.episode,
      url: item.url
    }
  }

  static mapCharacterItems(items: Character[]): CharacterItem[]{
    return items.map(this.mapCharacterItem);
  }
}
