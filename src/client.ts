import { MessageBus, MessageType } from "@/MessageBus";
import { AudioDriver } from "@/Audio";
import GameLoopWorker from '@/Worker/gameLoop.ts?worker';

(() => {
  const canvasElement = document.getElementById('game') as HTMLCanvasElement;
  const canvas = canvasElement.transferControlToOffscreen();
  const fpsAggregate: number[] = Array(100).fill(0);
  const worker = new GameLoopWorker();
  const bus = new MessageBus(worker);
  new AudioDriver(bus);
  bus.on(MessageType.REQUEST_GAME_FILES, () => {
    const canvas = document.getElementById('game');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.mix';
    fileInput.onchange = async () => {
      if (fileInput.files !== null && fileInput.files.length > 0) {
        const files = [];
        for (const file of fileInput.files) {
          const [, extension] = file.name.toLowerCase().split('.', 2);
          if (extension === 'mix') {
            const buffer = await file.arrayBuffer();
            files.push({ filename: file.name, data: new Uint8Array(buffer)});
          }
        }
        bus.sendMessage(MessageType.GAME_FILES_SELECTED, files);
        document.body.removeChild(fileInput);
        if (canvas) {
          canvas.style.display = 'block';
        }
      }
    };
    document.body.appendChild(fileInput);
    if (canvas) {
      canvas.style.display = 'none';
    }
  });
  bus.sendMessage(MessageType.TRANSFER_CANVAS, { canvas, width: canvasElement.offsetWidth, height: canvasElement.offsetHeight });
  
  const mapMouseEvent = (e: MouseEvent, type: keyof HTMLElementEventMap) => ({
    type,
    x: e.x,
    y: e.y,
    buttons: e.buttons,
    button: e.button,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
    metaKey: e.metaKey,
  });
  const mapKeyboardEvent = (e: KeyboardEvent, type: keyof HTMLElementEventMap) => ({
    type,
    code: e.code,
    key: e.key,
    location: e.location,
    shiftKey: e.shiftKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
  });
  const trackedMouseEvents = ['click', 'mousedown', 'mouseup', 'contextmenu', 'mousemove'] as const;
  trackedMouseEvents.forEach((type) => {
    canvasElement.addEventListener(type, (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      bus.sendMessage(MessageType.CANVAS_MOUSE_EVENT, mapMouseEvent(e, type))
    });
  });
  const trackedKeyboardEvents = ['keypress', 'keydown'] as const;
  trackedKeyboardEvents.forEach((type) => {
    canvasElement.addEventListener(type, (e: KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      bus.sendMessage(MessageType.CANVAS_KEYBOARD_EVENT, mapKeyboardEvent(e, type))
    });
  });

  canvasElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    bus.sendMessage(MessageType.CANVAS_WHEEL_EVENT, { deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, shiftKey: e.shiftKey });
  });

  bus.on(MessageType.DEBUG_INFO, ({ fps }) => { 
    fpsAggregate.push(fps);
    fpsAggregate.shift();
  });
  setInterval(() => {
    const fps = fpsAggregate.reduce((prev, val) => prev + val, 0) / fpsAggregate.length;
    (document.getElementById('fps') as HTMLParagraphElement).innerText = `${(1000 / fps).toFixed(0)} FPS`;
  }, 500);

})();
