import { GameConfig, TheaterConfig, TileCollection } from "@/Engine";
import { Map, Palette, ResourceLoader, Ini } from "@/Resources";
import { CanvasTexture, SpriteMaterial } from "three";
import { GraphicsManager } from "./GraphicsManager";
import { MapSprite } from "./MapSprite";

export class MapRenderer {
  private _tileCollection: TileCollection;

  constructor(private loader: ResourceLoader, private graphics: GraphicsManager) {
  }

  renderMap(mapName: string, gameConfig: GameConfig) {
    const map = this.loader.getResource(`${mapName}.map`, Map);
    const theaterConfig = gameConfig.enabledTheaters[map.theater];
    const palette = this.loader.getResource('isotem.pal', Palette);

    if (theaterConfig === undefined) {
      throw new Error(`Cannot load theater "${map.theater}", as it's unknown`);
    }

    const theater = this.loader.getResource(theaterConfig?.iniFile, Ini);
    console.log(`Loading theater ${map.theater}`);
    this.loadTilesets(theater, theaterConfig, palette);
    this.drawTiles(map);
    this.setCameraBounds(map);
  }

  private loadTilesets(theater: Ini, theaterConfig: TheaterConfig, palette: Palette) {
    this._tileCollection = new TileCollection(this.loader);
    this._tileCollection.loadTilesets(theater, theaterConfig, palette);
  }

  private setCameraBounds(map: Map) {
    const left = Math.max((map.localSize.topLeft.x + 1) * 60, 0);
    const top = Math.max(map.localSize.topLeft.y - 3, 0) * 45;
    const right = (map.localSize.topLeft.x + map.localSize.bottomRight.x) * 60;
    const bottom = 2 * (map.localSize.topLeft.y - 3 + map.localHeight + 5) * 15;
    this.graphics.setCameraBounds(left, top, right, bottom);
  }

  private drawTiles(map: Map) {
    const canvas = new OffscreenCanvas(map.maxTileCoords.x * 30, map.maxTileCoords.y * 15);
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error('Unable to get rendering context when drawing map tiles');
    }
    let maxX = 0;
    let maxY = 0;
    ctx.fillStyle = 'orange';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const tile of map.tiles) {
      if (this._tileCollection.tileExists(tile.index, tile.subIndex)) {
        console.error(`Unknown tile ${tile.index}`);
        continue;
      }
      const halfTileHeight = this._tileCollection.getTerrain(tile.index).blockImageHeight / 2;
      const halfTileWidth = this._tileCollection.getTerrain(tile.index).blockImageWidth / 2;
      ctx.drawImage(this._tileCollection.getTile(tile.index, tile.subIndex), canvas.width / 2 + ((tile.x - tile.y) * halfTileWidth), ((tile.x + tile.y) * halfTileHeight) - canvas.height / 2);
      if (maxX < tile.x) {
        maxX = tile.x;
      }
      if (maxY < tile.y) {
        maxY = tile.y;
      }
    }
    ctx.resetTransform();
    createImageBitmap(canvas).then((image) => {
      const texture = new CanvasTexture(image);
      texture.flipY = false;
      texture.center.set(0.5, 0.5);
      texture.repeat.set(1, -1);
      const material = new SpriteMaterial({ map: texture });
      const sprite = new MapSprite(material, map);
      this.graphics.trackDrawable(sprite);
    }).catch((e) => console.error(e));
  }
}