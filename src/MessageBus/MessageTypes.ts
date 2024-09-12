export enum MessageType {
  TRANSFER_CANVAS,
  REQUEST_GAME_FILES,
  GAME_FILES_SELECTED,
  CANVAS_MOUSE_EVENT,
  CANVAS_WHEEL_EVENT,
  CANVAS_KEYBOARD_EVENT,
  PLAY_AUDIO,
  AUDIO_FINISHED,
  DEBUG_INFO,
}

type TransferableMessages = {
  [key in MessageType]?: (message: MessageTypesLut[key]) => Transferable[];
}

export const transferableMessages: TransferableMessages = {
  [MessageType.TRANSFER_CANVAS]: ({canvas}) => [canvas],
};

export interface BaseMessage<Type extends MessageType> {
  type: Type;
  payload: unknown;
}

export interface CanvasMouseEventMessage {
  type: string;
  x: number;
  y: number;
  buttons: number;
  ctrlKey: boolean;
  altKey: boolean;
}

export interface CanvasKeyboardEventMessage {
  type: string;
  code: string;
  key: string;
  location: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface TransferCanvasMessage {
  canvas: OffscreenCanvas;
  width: number;
  height: number;
}

export enum AudioType {
  Game,
  Theme,
}

export interface PlayAudioMessage {
  id: string;
  data: Uint8Array;
  volume: number;
  loop: boolean;
  type: AudioType;
}

interface GameFile {
  filename: string
  data: Uint8Array;
}

interface DebugInfoMessage {
  fps: number;
  camera: {
    x: number;
    y: number;
    z: number;
  }
}

interface WheelEvent {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export type MessageTypesLut = {
  [T in MessageType]: {
    [MessageType.TRANSFER_CANVAS]: TransferCanvasMessage,
    [MessageType.REQUEST_GAME_FILES]: never,
    [MessageType.CANVAS_MOUSE_EVENT]: CanvasMouseEventMessage,
    [MessageType.CANVAS_KEYBOARD_EVENT]: CanvasKeyboardEventMessage,
    [MessageType.GAME_FILES_SELECTED]: GameFile[],
    [MessageType.PLAY_AUDIO]: PlayAudioMessage,
    [MessageType.AUDIO_FINISHED]: string,
    [MessageType.DEBUG_INFO]: DebugInfoMessage,
    [MessageType.CANVAS_WHEEL_EVENT]: WheelEvent,
  }[T]
};