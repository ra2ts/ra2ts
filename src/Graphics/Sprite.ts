import { Scene, Sprite as ThreeSprite } from "three";
import { AnimationSequence, Direction, Drawable, SpriteMaterial } from "@/Graphics";

const MS_PER_FRAME = 160;

export class Sprite implements Drawable {
  protected sprite: ThreeSprite;
  private ready = false;

  constructor(protected _material: SpriteMaterial, frame = 0) {
    if (this.material.frames.length <= frame) {
      frame = this.material.frames.length - 1;
    }
    this.sprite = new ThreeSprite(this.material.frames[frame]);
    _material.onReady.then(() => {
      this.ready = true;
      this.setCurrentFrame(frame);
    });
  }

  animateSequence(sequence: AnimationSequence, msPerFrame: number = MS_PER_FRAME): Promise<void> {
    return new Promise((resolve) => {
      let frameCount = 0;
      let i = 0;
      const timer = setInterval(() => {
        const nextFrame = sequence.offset + (sequence.directionOffset * Direction.East) + frameCount;
        if (this.material.frames.length > nextFrame) {
          this.setCurrentFrame(nextFrame);
          i++;
          frameCount += sequence.nextFrameOffset ?? 1;
        }
        if (i >= sequence.frameCount) {
          resolve();
          clearInterval(timer);
        }
      }, msPerFrame);
    });
  }

  setCurrentFrame(index: number) {
    this.sprite.material = this.material.frames[index];
  }

  public get position() {
    return this.sprite.position;
  }

  public get material() {
    return this._material;
  }

  public get mesh() {
    return this.sprite;
  }

  public setPos(x: number, y: number, z: number) {
    this.sprite.position.set(x, y, z);
  }

  addToScene(scene: Scene) {
    if (!this.ready) {
      this.material.onReady.then(() => {
        scene.add(this.sprite);
      });
    } else {
      scene.add(this.sprite);
    }
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.sprite);
    this.sprite.geometry.dispose();
  }
}