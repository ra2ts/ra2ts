import { Drawable } from "@/Graphics";
import { DroidSansBold } from "@/Graphics/Fonts";
import { ColorRepresentation, DoubleSide, Mesh, MeshBasicMaterial, Scene } from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class Text implements Drawable {
  private _mesh: Mesh;
  private _geometry: TextGeometry;

  constructor(private _text: string, private _size: number, private _color: ColorRepresentation) {
    this.text = _text;
  }

  public set text(text: string) {
    this._text = text;
    this._geometry = new TextGeometry(this._text, {
      font: DroidSansBold,
      size: this._size,
      curveSegments: 4,
    });
    const material = new MeshBasicMaterial({ color: this._color, side: DoubleSide });
    this._mesh = new Mesh(this._geometry, material);
    this._mesh.rotation.y = Math.PI * 2;
  }

  get position() {
    return this._mesh.position;
  }

  get mesh() {
    return this._mesh;
  }

  get visible() {
    return this._mesh.visible;
  }

  set visible(value: boolean) {
    this._mesh.visible = value;
  }

  get width(): number {
    this._geometry.computeBoundingBox();
    if (this._geometry.boundingBox === null) {
      return 0;
    }
    return this._geometry.boundingBox?.max.x - this._geometry.boundingBox?.min.x;
  }

  addToScene(scene: Scene) {
    scene.add(this._mesh);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this._mesh);
  }
}