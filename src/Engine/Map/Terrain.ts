import { MapTile } from '@/Resources';

export class Terrain {
  private _tile: MapTile;
  private _name: string;

  constructor(name: string, tile: MapTile) {
    this._name = name;
    this._tile = tile;
  }

  public get name(): string {
    return this._name;
  }

  public get tile(): MapTile {
    return this._tile;
  }
}