import { MapTile } from '@/Resources';

export class Overlay {
  private _tile: MapTile;
  private _overlayId: number;
  private _overlayValue: number;

  constructor(overlayId: number, overlayValue: number, tile: MapTile) {
    this._overlayId = overlayId;
    this._overlayValue = overlayValue;
    this._tile = tile;
  }

  public get overlayId(): number {
    return this._overlayId;
  }

  public get overlayValue(): number {
    return this._overlayValue;
  }

  public get tile(): MapTile {
    return this._tile;
  }
}