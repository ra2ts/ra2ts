import { Map } from "@/Resources";
import { Scene, Sprite as ThreeSprite, SpriteMaterial as ThreeSpriteMaterial } from "three";
import { Drawable } from "./Drawable";

export class MapSprite implements Drawable {
  protected sprite: ThreeSprite;

  constructor(private mapMaterial: ThreeSpriteMaterial, map: Map) {
    this.sprite = new ThreeSprite(this.mapMaterial);
    this.sprite.scale.set(map.maxTileCoords.x * 2, map.maxTileCoords.y, 1);
    this.sprite.position.set(0,0,0);
  }

  public get mesh() {
    return this.sprite;
  }

  addToScene(scene: Scene) {
    scene.add(this.sprite);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.sprite);
    this.sprite.geometry.dispose();
  }
}