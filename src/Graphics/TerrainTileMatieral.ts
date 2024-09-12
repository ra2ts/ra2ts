import { Palette, Terrain } from "@/Resources";

export class TerrainTileMaterial {
  private _tiles: OffscreenCanvas[] = [];

  constructor(private terrain: Terrain, private palette: Palette) {
    this.generateFrames();
  }

  generateFrames() {
    this._tiles = Array(this.terrain.tiles.length);
    for (let i = 0; i < this.terrain.tiles.length; i++) {
      const tile = this.terrain.tiles[i];
      if (tile.image.length == 0) {
        continue;
      }
      const {width, height, top, left} = this.getBounds(i);
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (ctx === null) {
        throw new Error('Could not load 2d canvas context');
      }
      // @ts-ignore: Builtin type has incorrect definition
      const idata = ctx.createImageData(width, height);
      for (let j = 0; j < tile.image.length; j++) {
        if (tile.image[j] === 0) {
          continue;
        }
        //const rowOffset = (((tile.y- (tile.height * this.terrain.blockImageHeight)) - top) * width) + (tile.x - left) + (Math.floor(j / this.terrain.blockImageWidth) * width) + (j % this.terrain.blockImageWidth);
        const heightOffset = (tile.y - top - (tile.height * (this.terrain.blockImageHeight / 2))) * width;
        const rowOffset = heightOffset + (Math.floor(j / this.terrain.blockImageWidth) * width) + (j % this.terrain.blockImageWidth);
        const {r, g, b} = this.palette.getColorAt(tile.image[j]);
        idata.data[(rowOffset * 4) + 0] = r;
        idata.data[(rowOffset * 4) + 1] = g;
        idata.data[(rowOffset * 4) + 2] = b;
        idata.data[(rowOffset * 4) + 3] = tile.image[j] === 0 ? 0 : 255;
      }
      if (tile.hasExtraData) {
        for (let j = 0; j < tile.extraImage.length; j++) {
          const extraHeightOffset = (tile.extraY - top - (tile.height * (this.terrain.blockImageHeight / 2))) * width;
          const rowOffset = extraHeightOffset + (tile.extraX - left) + (Math.floor(j / tile.extraWidth) * width) + (j % tile.extraWidth);
          const {r, g, b} = this.palette.getColorAt(tile.extraImage[j]);
          if (tile.extraImage[j] !== 0) {
            idata.data[(rowOffset * 4)+0] = r;
            idata.data[(rowOffset * 4)+1] = g;
            idata.data[(rowOffset * 4)+2] = b;
            idata.data[(rowOffset * 4)+3] = tile.extraImage[j] === 0 ? 0 : 255;
          }
        }
      }
      // @ts-ignore: Builtin type has incorrect definition
      ctx.putImageData(idata, 0, 0);
      this._tiles[i] = canvas;
    }
  }

  get frames() {
    return this._tiles;
  }

  public getBounds(index: number) {
    if (index >= this.terrain.tiles.length) {
      return { left: 0, top: 0, width: 0, height: 0, tileXOffset: 0, tileYOffset: 0 };
    }
    const img = this.terrain.tiles[index];

    let left = img.x;
		let top = img.y - (img.height * (this.terrain.blockImageHeight / 2));
    let width = this.terrain.blockImageWidth;
    let height = this.terrain.blockImageHeight;
    if (img.hasExtraData) {
      if (img.extraX < 0) {
        //left += img.extraX;
        //width -= img.extraX;
        left = Math.min(left, img.extraX);
      }
      top = Math.min(top, img.extraY - (img.height * (this.terrain.blockImageHeight / 2)));
      const bottom = Math.max(img.y + this.terrain.blockImageHeight, img.extraY + img.extraHeight);
      width = Math.max(width, img.extraWidth);
      height = bottom - top;
    }
    const tileXOffset = img.x - left;
    const tileYOffset = img.y - top;

    return { left, top, width, height, tileXOffset, tileYOffset };
  }
}