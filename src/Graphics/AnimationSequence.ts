import { Direction } from "@/Graphics";

export interface AnimationSequence {
  offset: number;
  frameCount: number;
  directionOffset: number;
  direction?: Direction | null;
  nextFrameOffset?: number;
}
