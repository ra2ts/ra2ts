import { Object3D, Scene } from "three";

export interface Drawable {
  addToScene(scene: Scene): void;
  removeFromScene(scene: Scene): void;
  readonly mesh: Object3D;
}