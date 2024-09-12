import { Palette, ResourceLoader } from "@/Resources";
import { Theater, TheaterConfig, TileSet } from "@/Engine";

export class TileCollection {
  private _tileSets: TileSet[] = [];

  constructor(private loader: ResourceLoader) {
  }

  public loadTilesets(theater: Theater, theaterConfig: TheaterConfig, palette: Palette) {
    let i = 0;
    while (theater.getTileset(i)) {
      const tileset = theater.getTileset(i);
      const tileCount = tileset?.tilesInSet ?? 0;
      if (tileCount === 0 || tileset?.filename === undefined) {
        i++;
        continue;
      }

      const isCLAT = theater.isCLAT(i);
      const isLAT = theater.isLAT(i);
      
      for (let j = 1; j <= tileCount; j++) {
        this._tileSets.push(new TileSet(this.loader, tileset.filename, j, theaterConfig, palette, isCLAT, isLAT));
      }
      i++;
    }
  }

  public getTileSet(setIndex: number) {
    return this._tileSets[setIndex];
  }

  public getTile(setIndex: number, subTile: number) {
    return this._tileSets[setIndex].getSubTile(subTile);
  }

  public getTileBounds(setIndex: number, subTile: number) {
    return this._tileSets[setIndex].getSubTileBounds(subTile);
  }

  public getTerrain(setIndex: number) {
    return this._tileSets[setIndex].getTerrain();
  }

  public tileExists(setIndex: number, subTile: number) {
    return this._tileSets[setIndex] != undefined && this._tileSets[setIndex].getSubTile(subTile) != undefined;
  }
}