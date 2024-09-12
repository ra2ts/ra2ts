import { Palette, ResourceLoader } from "@/Resources";
import { TileSetEntry, TheaterConfig } from "@/Engine";

const A_CHAR_CODE = 'a'.charCodeAt(0);
const Z_CHAR_CODE = 'z'.charCodeAt(0);

export class TileSet {
  private _entries: TileSetEntry[] = [];

  constructor(private loader: ResourceLoader, private tileSetName: string, index:number, theaterConfig: TheaterConfig, palette: Palette, isCLAT: boolean, isLAT: boolean) {
    for (let suffix = A_CHAR_CODE - 1; suffix <= Z_CHAR_CODE; suffix++) {
      const filename = tileSetName.toLowerCase() + index.toString().padStart(2, '0') + (suffix < A_CHAR_CODE ? '' : String.fromCharCode(suffix));
      const entry = new TileSetEntry(this.loader);
      if (entry.load(filename, theaterConfig.fileExtension, palette, isCLAT, isLAT)) {
        this._entries.push(entry);
      }
    }
  }

  getSubTile(subindex: number) {
    if (this._entries.length === 0) {
      return null;
    }
    
    return this._entries[Math.floor(Math.random() * this._entries.length)].getSubTile(subindex);
  }

  getSubTileBounds(subindex: number) {
    if (this._entries.length === 0) {
      return null;
    }
    
    return this._entries[0].getSubTileBounds(subindex);
  }

  getTerrain() {
    return this._entries[0].terrain;
  }
}