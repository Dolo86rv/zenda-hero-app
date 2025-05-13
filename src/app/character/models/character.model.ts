import { Gender, Species, Status, Location } from "./character-response.model";

export interface CharacterItem {
  id:       number;
  name:     string;
  status:   Status;
  species:  Species;
  type:     string;
  gender:   Gender;
  created:  Date;
  origin:   Location;
  location: Location;
  image:    string;
  episode:  string[];
  url:      string;
}
