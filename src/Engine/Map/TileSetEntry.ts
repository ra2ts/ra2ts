import { TerrainTileMaterial } from "@/Graphics";
import { Palette, ResourceLoader, Terrain } from "@/Resources";

export class TileSetEntry {
  private _material: TerrainTileMaterial;
  private _terrain: Terrain;
  private _filename: string;

  constructor(private loader: ResourceLoader) {

  }
  
  load(filename: string, theaterFileExtension: string, palette: Palette, isCLAT: boolean, isLAT: boolean): boolean {
    let terrain: Terrain | null = null;
    if (this.loader.resourceExists(`${filename}.${theaterFileExtension}`)) {
      terrain = this.loader.getResource(`${filename}.${theaterFileExtension}`, Terrain);
      this._filename = `${filename}.${theaterFileExtension}`;
    } else if (this.loader.resourceExists(`${filename}.shp`)) {
      terrain = this.loader.getResource(`${filename}.shp`, Terrain);
      this._filename = `${filename}.shp`;
    }

    if (terrain === null) {
      return false
    }

    terrain.isCLAT = isCLAT;
    terrain.isLAT = isLAT;

    const material = new TerrainTileMaterial(terrain, palette);
    this._terrain = terrain;
    this._material = material;

    return true;
  }

  getSubTile(subindex: number) {
    return this._material.frames[subindex + 1];
  }

  getSubTileBounds(subindex: number) {
    return this._material.getBounds(subindex);
  }

  get terrain() {
    return this._terrain;
  }

  get material() {
    return this._material;
  }
}