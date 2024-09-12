import { AnimationSequence } from "@/Graphics";

export interface AnimationSequenceCollection {
  ready: AnimationSequence;
  guard: AnimationSequence;
  tread: AnimationSequence;
  prone: AnimationSequence;
  walk: AnimationSequence;
  swim: AnimationSequence;
  fireUp: AnimationSequence;
  wetAttack: AnimationSequence;
  down: AnimationSequence;
  crawl: AnimationSequence;
  up: AnimationSequence;
  fireProne: AnimationSequence;
  idle: AnimationSequence[];
  wetIdle: AnimationSequence[];
  die: AnimationSequence[];
  wetDie: AnimationSequence[];
  deploy: AnimationSequence;
  deployed: AnimationSequence;
  undeploy: AnimationSequence;
  cheer: AnimationSequence;
  paradrop: AnimationSequence;
  fly: AnimationSequence;
  hover: AnimationSequence;
  fireFly: AnimationSequence;
  tumble: AnimationSequence;
  airDeathStart: AnimationSequence;
  airDeathFalling: AnimationSequence;
  airDeathFinish: AnimationSequence;
}
