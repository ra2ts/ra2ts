import { CanvasKeyboardEventMessage, MessageBus, MessageType } from "@/MessageBus";

export class KeyboardManager {
  private state = {};

  constructor(private bus: MessageBus) {
    bus.on(MessageType.CANVAS_KEYBOARD_EVENT, (e) => this.onKeyEvent(e));
  }

  public isKeyDown(): boolean {
    return false;
  }

  private onKeyEvent(e: CanvasKeyboardEventMessage) {

  }
}