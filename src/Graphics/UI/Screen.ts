import { VirtualFileSystem } from "@/Resources";
import { GraphicsManager } from "@/Graphics";
import { Internationalization } from "@/Engine";
import { AudioManager } from "@/Audio";
import { Scene } from "three";

export interface Screen {
  removeFromScene(scene: Scene): void;
}

export interface ScreenConstructable {
  new(resources: VirtualFileSystem, graphics: GraphicsManager, i18n: Internationalization, audio: AudioManager): Screen;
}