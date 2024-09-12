import { Drawable } from '@/Graphics';
import { CanvasMouseEventMessage } from '@/MessageBus';
import { Scene } from 'three';

const uiTargets: MouseEventTargetable[] = [];
const gameObjectTargets: MouseEventTargetable[] = [];

export interface MouseEventTargetable extends Drawable {
  onClick?(e: CanvasMouseEventMessage): void;
  onMouseOver?(e: CanvasMouseEventMessage): void;
}

export enum MouseEventTargetType {
  UI,
  GameObject,
}

export function getMouseEventGameObjectTargets(): MouseEventTargetable[] {
  return gameObjectTargets;
}

export function getMouseEventUITargets(): MouseEventTargetable[] {
  return uiTargets;
}

export function MouseEventTarget(type: MouseEventTargetType) {
  return <T extends { new (...args: any[]): MouseEventTargetable }>(constructor: T) => {
    return class extends constructor {
      private lastMouseEvent: CanvasMouseEventMessage;

      addToScene(scene: Scene): void {
        super.addToScene(scene);
        switch (type) {
          case MouseEventTargetType.GameObject:
            gameObjectTargets.push(this);
            return;
          case MouseEventTargetType.UI:
            uiTargets.push(this);
            return;
        }
      }

      onClick(e: CanvasMouseEventMessage): void {
        if (e !== this.lastMouseEvent && super.onClick !== undefined) {
          this.lastMouseEvent = e;
          super.onClick(e);
        }
      }

      onMouseOver(e: CanvasMouseEventMessage): void {
        if (e !== this.lastMouseEvent && super.onMouseOver !== undefined) {
          this.lastMouseEvent = e;
          super.onMouseOver(e);
        }
      }

      removeFromScene(scene: Scene): void {
        super.removeFromScene(scene);
        switch (type) {
          case MouseEventTargetType.GameObject:
            gameObjectTargets.splice(gameObjectTargets.indexOf(this), 1);
            return;
          case MouseEventTargetType.UI:
            uiTargets.splice(uiTargets.indexOf(this), 1);
            return;
        }
      }
    }
  }
}