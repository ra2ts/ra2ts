import { MessageBus } from '@/MessageBus';
import { Drawable } from './Drawable';
import { OffscreenGraphicsManager, Screen } from '@/Graphics';

export const CurrentGraphicsManager: GraphicsManagerConstructable = OffscreenGraphicsManager;

export interface GraphicsManager {
  resolution: { width: number; height: number };

  clearUI(): void;
  trackDrawable(art: Drawable): void
  trackUIDrawable(art: Drawable): void
  setScreen(newScreen: Screen): void;
  setCameraBounds(x1: number, y1: number, x2: number, y2: number): void;
}

export interface GraphicsManagerConstructable {
  new(bus: MessageBus): GraphicsManager;
}