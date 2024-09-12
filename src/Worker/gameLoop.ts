import { MessageBus, MessageType } from "@/MessageBus";
import { ResourceLoader, VirtualFileSystem, Shp } from "@/Resources";
import { CurrentGraphicsManager } from "@/Graphics";
import { KeyboardManager } from "@/Input";
import { Internationalization } from "@/Engine";
import { RA2Config } from "@/Games";
import { AudioManager } from "@/Audio/AudioManager";
import { Battle } from "@/Engine/Battle";

(async () => {
  const config = RA2Config;
  const bus = new MessageBus(self);
  const vfs = new VirtualFileSystem(config, bus);
  const graphicsManager = new CurrentGraphicsManager(bus);
  const keyboardManager = new KeyboardManager(bus);
  const resourceLoader = new ResourceLoader(vfs);
  const battle = new Battle(resourceLoader, graphicsManager);

  const readyTimer = setInterval(() => {
    if (vfs.ready === true) {
      clearInterval(readyTimer);
      onLoaded();
    }
  }, 1);

  function onLoaded() {
    const i18n = new Internationalization(vfs, config);
    const audio = new AudioManager(vfs, bus);
    new config.startScreen(vfs, graphicsManager, i18n, audio);
    battle.loadMap('tn04t2', config);
  }
})();