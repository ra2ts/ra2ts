import { AudioManager } from "@/Audio";
import { Internationalization } from "@/Engine";
import { GraphicsManager, Screen } from "@/Graphics";
import { VirtualFileSystem } from "@/Resources";
import { BaseMenu } from "./BaseMenu";
import { MainMenu } from "./MainMenu";

export class SkirmishMenu extends BaseMenu implements Screen {
  constructor(resources: VirtualFileSystem, graphics: GraphicsManager, i18n: Internationalization, audio: AudioManager) {
    super(
      resources,
      graphics,
      i18n,
      audio,
      'GUI:SKIRMISHGAME',
      [
        { label: 'GUI:STARTGAME', helpText: 'STT:MAINBUTTONSINGLEPLAYER', onClick: () => this.onStartClicked() },
        { label: 'GUI:CHOOSEMAP', helpText: 'STT:MAINBUTTONSINGLEPLAYER', onClick: () => this.onStartClicked() },
        { label: 'GUI:BACK', helpText: 'STT:MAINBUTTONWWONLINE', onClick: () => this.onBackClicked(), index: -1 },
      ]
    );
  }

  onStartClicked() {
    console.log('Start Clicked');
  }

  onBackClicked() {
    this.changeScreen(MainMenu)
  }
}