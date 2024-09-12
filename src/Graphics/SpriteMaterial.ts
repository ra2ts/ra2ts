import { Palette, Shp } from "@/Resources";
import { SpriteMaterial as ThreeSpriteMaterial, CanvasTexture } from "three";

export class SpriteMaterial {
  private _frames: ThreeSpriteMaterial[] = [];
  private readyPromise: Promise<void>;
  private framesWithData: number = 0;
  private _isReady = false;

  constructor(private shp: Shp, private palette: Palette) {
    this.generateFrames();
  }

  setPalette(palette: Palette) {
    this.palette = palette;
    this.generateFrames();
  }

  generateFrames() {
    this.readyPromise = new Promise((resolve) => {
      this._frames = new Array(this.shp.frames.length);
      this.framesWithData = this.shp.frames.filter((f) => f.data.length !== 0).length;
      const framePromises = this.shp.frames.map(async (frame, frameIndex) => {
        if (frame.data.length == 0) {
          return;
        }
        const canvas = new OffscreenCanvas(frame.width, frame.height);
        const ctx = canvas.getContext('2d');
        if (ctx === null) {
          throw new Error('Could not load 2d canvas context');
        }
        // @ts-ignore: Builtin type has missing property
        const idata = ctx.createImageData(frame.width, frame.height);
        for (let j = 0; j < frame.data.length; j++) {
          const {r, g, b} = this.palette.getColorAt(frame.data[j]);
          if (frame.data[j] !== 1) {
            idata.data[(j * 4)] = r;
            idata.data[(j * 4)+1] = g;
            idata.data[(j * 4)+2] = b;
            idata.data[(j * 4)+3] = frame.data[j] === 0 ? 0 : 255;
          } else {
            idata.data[(j * 4)] = 0;
            idata.data[(j * 4)+1] = 0;
            idata.data[(j * 4)+2] = 0;
            idata.data[(j * 4)+3] = 125;
          }
        }
        // @ts-ignore: Builtin type has missing property
        ctx.putImageData(idata, 0, 0);
        const image = await createImageBitmap(canvas)
        const texture = new CanvasTexture(image);
        texture.flipY = false;
        texture.center.set(0.5, 0.5);
        texture.repeat.set(1, -1);
        this._frames[frameIndex] = new ThreeSpriteMaterial({ map: texture });
      });
      Promise.all(framePromises).then(() => {
        resolve();
        this._isReady = true;
      });
    });
  }

  public destroy() {
    for (const frame of this._frames) {
      frame.dispose();
    }
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get onReady() {
    return this.readyPromise;
  }

  get frames(): ThreeSpriteMaterial[] {
    return this._frames;
  }

  public frameWidth(i: number): number {
    if (i < this.shp.frames.length) {
      return this.shp.frames[i].width;
    }
    throw new RangeError(`Frame ${i} is out of bounds`);
  }

  public frameHeight(i: number): number {
    if (i < this.shp.frames.length) {
      return this.shp.frames[i].height;
    }
    throw new RangeError(`Frame ${i} is out of bounds`);
  }
}