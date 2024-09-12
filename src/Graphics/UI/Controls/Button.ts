import { Scene } from "three";
import { UISprite, SpriteMaterial, Text } from "@/Graphics";
import { MouseEventTarget, MouseEventTargetType } from "@/Input";
import { CanvasMouseEventMessage } from "@/MessageBus";

const CLICK_ANIMATION_MS = 30;

@MouseEventTarget(MouseEventTargetType.UI)
export class Button extends UISprite {
  private labelDrawable: Text;
  private onClickCallbacks: (() => void)[] = [];
  private _disabled: boolean = false;

  constructor (private _label: string, material: SpriteMaterial, frame = 0) {
    super(material, frame);

    this.labelDrawable = new Text(_label, 8, 0xFFFF00);
    this.labelDrawable.position.set(this.position.x - this.labelDrawable.width / 2, this.position.y + 17, 6);
  }

  public get label() {
    return this._label;
  }

  public set label(value: string) {
    this._label = value;
  }
  public get disabled() {
    return this._disabled;
  }

  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public setLabelVisibility(visible: boolean) {
    this.labelDrawable.visible = visible;
  }

  addToScene(scene: Scene) {
    super.addToScene(scene);
    this.labelDrawable.addToScene(scene);
  }

  removeFromScene(scene: Scene) {
    super.removeFromScene(scene);
    this.labelDrawable.removeFromScene(scene);
  }
  
  setPos(x: number, y: number, z: number) {
    super.setPos(x, y, z);
    this.labelDrawable.position.set(x - (this.labelDrawable.width / 2) + 74, y + 17, z + 1);
  }

  onClick(callback: () => void): void;
  onClick(e: CanvasMouseEventMessage): void;
  public onClick(arg: CanvasMouseEventMessage | (() => void)): void {
    if (typeof arg === 'function') {
      this.onClickCallbacks.push(arg);
    } else if (!this._disabled) {
      this.animateSequence({ offset: 2, frameCount: 3, directionOffset: 0 }, CLICK_ANIMATION_MS)
        .then(() => this.animateSequence({ offset: 4, frameCount: 3, directionOffset: 0, nextFrameOffset: -1 }, CLICK_ANIMATION_MS));
      this.onClickCallbacks.forEach((callback) => callback());
    }
  }
}