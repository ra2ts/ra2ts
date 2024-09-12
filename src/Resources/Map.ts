import { BoundingBox, TheaterType, Overlay } from "@/Engine";
import { Terrain } from "@/Engine/Map/Terrain";
import { DataReader, MapTile } from "@/Resources";
import lzo from './lzo1x';
import { Format, decode as decodeFormat5 } from "./Encoding/Format5";
import { Ini } from '@/Resources/Ini';
import type { IniSection } from '@/Resources/IniSection';

type TileDictonary = {
  [key: `${number},${number}`]: MapTile,
}

export enum TileDirection {
  Bottom,
  Top,
  Right,
  Left,
  TopRight,
  TopLeft,
  BottomRight,
  BottomLeft,
}

export class Map {
  private _theater: TheaterType;
  private _size: BoundingBox;
  private _localSize: BoundingBox;
  private _tiles: TileDictonary = {};
  private _preview: Uint8Array;
  private _previewSize: BoundingBox;
  private _maxSize: BoundingBox = { topLeft: { x: 0, y: 0 }, bottomRight: { x:0, y: 0 } };
  private _overlays: Overlay[] = [];
  private _terrain: Terrain[] = [];

  static fromArray(data: Uint8Array): Map {
    const ini = Ini.fromArray(data);
    const map = new Map();

    const mapIni = ini.getSection('Map');
    map._size = mapIni.readBoundingBox('Size');
    map._localSize = mapIni.readBoundingBox('LocalSize');

    map._theater = <TheaterType>mapIni.readString('Theater').toLowerCase();
    if (!Object.values<string>(TheaterType).includes(map._theater)) {
      throw new Error('Unknown theater type');
    }

    const decompressSection = (section: IniSection) => {
      const compressedData = section.asDataBlock();
      const reader = new DataReader(compressedData);
      const decompressedData: number[] = [];
      while (reader.pos < reader.length) {
        const inputSize = reader.readUint16();
        const outputSize = reader.readUint16();
        const data = reader.read(inputSize);
        const state: { inputBuffer: Uint8Array, outputBuffer: Uint8Array | null } = { inputBuffer: data, outputBuffer: null };
        const result = lzo.decompress(state);
  
        if (result !== 0 || state.outputBuffer === null || outputSize != state.outputBuffer.length) {
          throw new Error('Could not decompress map pack');
        }
        decompressedData.push(...state.outputBuffer);
      }
      return new Uint8Array(decompressedData);
    }
    
    const mapPackDecompressed = decompressSection(ini.getSection('IsoMapPack5'));
    const decompressedReader = new DataReader(mapPackDecompressed);
    const count = Math.floor(decompressedReader.length / 11);
    let tilesRead = 0;
    while (decompressedReader.pos < decompressedReader.length && tilesRead < count) {
      const tile = MapTile.fromReader(decompressedReader);
      map._tiles[`${tile.x},${tile.y}`] = tile;
      tilesRead++;
      if (map._maxSize.bottomRight.x < tile.x) {
        map._maxSize.bottomRight.x = tile.x;
      }
      if (map._maxSize.bottomRight.y < tile.y) {
        map._maxSize.bottomRight.y = tile.y;
      }
    }

    const format80Data = ini.getSection('OverlayPack').asDataBlock();
    const overlayPack = decodeFormat5(format80Data, 1 << 18, Format.Format80);
    const overlayDataPack = decodeFormat5(ini.getSection('OverlayDataPack').asDataBlock(), 1 << 18, Format.Format80);
    for (let y = 0; y < map._maxSize.bottomRight.y; y++) {
      for (let x = map._maxSize.bottomRight.x * 2 - 2; x >= 0; x--) {
        const t = map._tiles[`${x},${y}`];
        if (t == null) {
          continue;
        }
        const idx = t.x + 512 * t.y;
        const overlayId = overlayPack[idx];
        if (overlayId != 0xFF) {
          const overlayValue = overlayDataPack[idx];
          map._overlays.push(new Overlay(overlayId, overlayValue, t));
        }
      }
    }

    map._previewSize = ini.getSection('Preview').readBoundingBox('Size');
    map._preview = decompressSection(ini.getSection('PreviewPack'));

    const iniFormat = ini.getSection('Basic').readInt('NewINIFormat');
    map._terrain = ini.getSection('Terrain').asArray().map(({ key, value }) => {
      let x = 0;
      let y = 0;
      if (iniFormat === 4) {
        x = key % 1000;
        y = Math.floor(key / 1000);
      }
      const tile = map._tiles[`${x},${y}`];
      return new Terrain(value, tile);
    });

    return map;
  }

  getNeighbourTile(tile: MapTile, direction: TileDirection) {
    let y = tile.y;
    const x = tile.x;
    switch (direction) {
      case TileDirection.Bottom: 
        return this._tiles[`${x},${y + 1}`];
      case TileDirection.Top: 
        return this._tiles[`${x},${y - 1}`];
      case TileDirection.Right: 
        return this._tiles[`${x + 2},${y}`];
      case TileDirection.Left: 
        return this._tiles[`${x - 2},${y}`];
    }

    y += x % 2;
    switch (direction) {
      case TileDirection.BottomLeft:
        return this._tiles[`${x - 1},${y}`];

      case TileDirection.BottomRight:
        return this._tiles[`${x + 1},${y}`];

      case TileDirection.TopLeft:
        if (x < 1 || y < 1) return null;
        return this._tiles[`${x - 1},${y - 1}`];

      case TileDirection.TopRight:
        return this._tiles[`${x + 1},${y - 1}`];
    }
  }

  getTile(x: number, y: number): MapTile {
    return this._tiles[`${x},${y}`];
  }

  get theater() {
    return this._theater;
  }

  get preview() {
    return this._preview;
  }

  get previewWidth() {
    return this._previewSize.bottomRight.x;
  }

  get previewHeight() {
    return this._previewSize.bottomRight.y;
  }

  get tiles() {
    return Object.values(this._tiles);
  }

  get maxTileCoords() {
    return this._maxSize.bottomRight;
  }

  get width() {
    return this._size.bottomRight.x;
  }

  get height() {
    return this._size.bottomRight.y;
  }

  get localSize() {
    return this._localSize;
  }

  get localWidth() {
    return this._localSize.bottomRight.x - this._localSize.topLeft.x;
  }

  get localHeight() {
    return this._localSize.bottomRight.y - this._localSize.topLeft.y;
  }

  get overlays() {
    return this._overlays;
  }

  get terrain() {
    return this._terrain;
  }
}