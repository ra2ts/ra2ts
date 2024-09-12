import { CanvasMouseEventMessage, MessageBus, MessageType } from '@/MessageBus';
import { WebGLRenderer, PerspectiveCamera, Scene, OrthographicCamera, Vector2, Raycaster, Camera, Box3, Vector3, Frustum, Matrix4 } from 'three';
import { Drawable, Screen } from '@/Graphics';
import { getMouseEventGameObjectTargets, getMouseEventUITargets, MouseEventTargetable } from '@/Input';

const MIN_ZOOM = 4;
const MAX_ZOOM = 180;

export class BaseGraphicsManager {
  protected renderer: WebGLRenderer;
  protected currentScene: Scene;
  protected uiScene: Scene;
  protected camera: PerspectiveCamera;
  protected uiCamera: OrthographicCamera;
  protected rayCaster: Raycaster;
  protected lastMouseEvent: CanvasMouseEventMessage | undefined;
  protected currentScreen: Screen;
  protected cameraBounds: Box3;

  constructor(private bus: MessageBus) {
    this.rayCaster = new Raycaster();

    bus.on(MessageType.CANVAS_MOUSE_EVENT, (e) => {
      this.lastMouseEvent = e;
    });
    bus.on(MessageType.CANVAS_WHEEL_EVENT, (e) => {
      if (this.cameraBounds) {
        const frustrum = new Frustum();
        frustrum.setFromProjectionMatrix(new Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
        if (frustrum.intersectsBox(this.cameraBounds)) {
          return;
        }
      }
      if (Math.abs(e.deltaY) > 1 && e.metaKey === true) {
        this.camera.position.setZ(Math.min(MAX_ZOOM, Math.max(this.camera.position.z + (e.deltaY * 0.1), MIN_ZOOM)));
      } else {
        if (Math.abs(e.deltaY) > 1) {
          this.camera.position.setY(this.camera.position.y - (e.deltaY * 0.2));
        }
        if (Math.abs(e.deltaX) > 1) {
          this.camera.position.setX(this.camera.position.x + (e.deltaX * 0.2));
        }
      }

    });
  }

  public get resolution() {
    const size: Vector2 = new Vector2();
    this.renderer.getSize(size);
    return { width: size.width, height: size.height };
  }

  public trackDrawable(art: Drawable): void {
    art.addToScene(this.currentScene);
  }

  public trackUIDrawable(art: Drawable): void {
    art.addToScene(this.uiScene);
  }

  public clearUI() {
    this.uiScene.clear();
  }

  public setScreen(newScreen: Screen) {
    this.currentScreen.removeFromScene(this.currentScene);
    this.currentScreen = newScreen;
  }

  public renderFrame() {
    const start = performance.now();
    requestAnimationFrame(this.renderFrame.bind(this));

    this.checkMouseTargets();

    this.renderer.clear();
    this.renderer.render(this.currentScene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.uiScene, this.uiCamera);
    const end = performance.now();
    this.bus.sendMessage(MessageType.DEBUG_INFO, { fps: end - start, camera: { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z } })
  }

  public setCameraBounds(x1: number, y1: number, x2: number, y2: number): void {
    this.cameraBounds = new Box3(new Vector3(x1, y1, 0), new Vector3(x2, y2, 1));
  }

  private checkMouseTargets() {
    if (this.lastMouseEvent === undefined) {
      return;
    }

    this.checkMouseIntersections(getMouseEventGameObjectTargets(), this.camera);
    this.checkMouseIntersections(getMouseEventUITargets(), this.uiCamera);

    if (this.lastMouseEvent.type === 'click') {
      this.lastMouseEvent.type = 'mousemove';
    }
  }

  private checkMouseIntersections(targets: MouseEventTargetable[], camera: Camera) {
    if (this.lastMouseEvent === undefined) {
      return;
    }
    const resolution = this.resolution;
    const pointer = {
      x: (this.lastMouseEvent.x / resolution.width) * 2 - 1,
      y: -(this.lastMouseEvent.y / resolution.height) * 2 + 1,
    };
    this.rayCaster.setFromCamera(pointer, camera);
    const intersections = this.rayCaster.intersectObjects(targets.map(({ mesh }) => mesh));
    for (const intersection of intersections) {
      const target = targets.find((val) => val.mesh === intersection.object);
      if (target !== undefined) {
        if (target.onMouseOver !== undefined) {
          target.onMouseOver(this.lastMouseEvent);
        }
        if (target.onClick !== undefined && this.lastMouseEvent.type === 'click') {
          target.onClick(this.lastMouseEvent);
        }
      }
    }
  }
}