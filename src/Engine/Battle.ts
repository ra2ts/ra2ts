import { GraphicsManager, Sprite } from "@/Graphics";
import { MapRenderer } from "@/Graphics/MapRenderer";
import { TerrainTileMaterial } from "@/Graphics/TerrainTileMatieral";
import { Map, Palette, ResourceLoader, Shp, Terrain } from "@/Resources";
import { Ini } from "@/Resources/Ini";
import { GameConfig } from "./GameConfig";

const A_CHAR_CODE = 'a'.charCodeAt(0);
const Z_CHAR_CODE = 'z'.charCodeAt(0);

export class Battle {
  _terrainTiles: Terrain[] = [];
  _tileMaterials: TerrainTileMaterial[] = [];
  constructor(private loader: ResourceLoader, private graphics: GraphicsManager) {

  }

  loadMap(mapName: string, gameConfig: GameConfig) {
    const renderer = new MapRenderer(this.loader, this.graphics);
    renderer.renderMap(mapName, gameConfig);
    console.log('finished loading map');
  }
}