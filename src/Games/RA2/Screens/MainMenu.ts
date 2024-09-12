import { AudioManager } from "@/Audio";
import { Internationalization } from "@/Engine";
import { GraphicsManager, Screen } from "@/Graphics";
import { VirtualFileSystem } from "@/Resources";
import { BaseMenu } from "./BaseMenu";
import { SkirmishMenu } from "./SkirmishMenu";

export class MainMenu extends BaseMenu implements Screen {
  constructor(resources: VirtualFileSystem, graphics: GraphicsManager, i18n: Internationalization, audio: AudioManager) {
    super(
      resources,
      graphics,
      i18n,
      audio,
      'GUI:MAINMENU',
      [
        { label: 'GUI:SINGLEPLAYER', helpText: 'STT:MAINBUTTONSINGLEPLAYER', onClick: () => this.onSinglePlayerClicked() },
        { label: 'GUI:WWONLINE', helpText: 'STT:MAINBUTTONWWONLINE', onClick: () => this.onInternetPlayClicked() },
        { label: 'GUI:OPTIONS', helpText: 'STT:MAINBUTTONWWONLINE', onClick: () => this.onOptionsClicked() },
      ]
    );
  }

  onSinglePlayerClicked() {
    console.log('Single player clicked');
    this.changeScreen(SkirmishMenu);
  }

  onInternetPlayClicked() {
    console.log('Internet clicked');
  }

  onOptionsClicked() {
    console.log('Options clicked');
  }
}