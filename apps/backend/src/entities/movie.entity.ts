import { Entity } from "./entity";

export interface Movie extends Entity {
  title: string;
  overview: string;
  releaseDate?: string;
  image?: string;
  popularity?: number;
}
