import { MessageTypesLut, MessageType, BaseMessage, transferableMessages } from "./MessageTypes";

type OptionalType<Type extends MessageType> = MessageTypesLut[Type] extends never ? [] : [MessageTypesLut[Type]];
type MessageCallback<Type extends MessageType> = (payload: MessageTypesLut[Type]) => void;

export class MessageBus {
  private listeners: { [key in MessageType]?: MessageCallback<key>[] } = {};

  public constructor(private worker: WorkerGlobalScope & typeof globalThis | Worker) {
    worker.onmessage = (msg: MessageEvent) => this.onMessage(msg.data as BaseMessage<MessageType>);
  }

  public transfer(transfer: Transferable[]) {
    this.worker.postMessage(null, transfer);
  }

  public sendMessage<Type extends MessageType>(type: Type, ...[payload]: OptionalType<Type>) {
    const msg = { type, payload };
    let transfer: Transferable[] = [];
    const callback = transferableMessages[type];
    if (callback !== undefined && payload != undefined) {
      transfer = callback(payload);
    }
    this.worker.postMessage(msg, transfer);
  }

  public on<Type extends MessageType>(type: Type, callback: MessageCallback<Type>): void {
    if (this.listeners[type] === undefined) {
      this.listeners[type] = [];
    }
    this.listeners[type]?.push(callback)
  }

  private onMessage<Type extends MessageType>({ type, payload }: BaseMessage<Type>): void {
    if (this.listeners[type]) {
      this.listeners[type]?.forEach((callback) => callback(payload as MessageTypesLut[Type]))
    }
  }
}