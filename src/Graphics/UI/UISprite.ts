import { Sprite } from "@/Graphics";

export class UISprite extends Sprite {
  setCurrentFrame(index: number) {
    super.setCurrentFrame(index);
    this.sprite.scale.set(this.sprite.material.map?.image.width, this.sprite.material.map?.image.height, 1);
    this.sprite.center.set(0, 0);
  }
}