import { MessageBus, MessageType } from '@/MessageBus';
import { WebGLRenderer, PerspectiveCamera, Scene, OrthographicCamera, Vector3 } from 'three';
import { BaseGraphicsManager } from '@/Graphics';

export class OffscreenGraphicsManager extends BaseGraphicsManager {
  constructor(bus: MessageBus) {
    super(bus);
    bus.on(MessageType.TRANSFER_CANVAS, ({canvas, width, height}) => {
      this.setCanvas(canvas, width, height);
    });
  }

  private setCanvas(canvas: OffscreenCanvas, width: number, height: number) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height, false);
    this.renderer.autoClear = false;
    this.currentScene = new Scene();
    this.uiScene = new Scene();
    this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this.uiCamera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 10);
    this.camera.position.z = 40;
    this.camera.position.x = -50;
    this.camera.position.y = 0;
    //this.camera.rotateOnAxis(new Vector3(0, 0, 1), 1.25);
    this.uiCamera.position.set(width / 2, height / 2, 10);
    this.renderFrame();
  }
}