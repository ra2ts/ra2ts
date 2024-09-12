import { AudioManager } from "@/Audio";
import { Internationalization } from "@/Engine";
import { GraphicsManager, Button, SpriteMaterial, UISprite, Text, ScreenConstructable } from "@/Graphics";
import { Palette, VirtualFileSystem, Shp } from "@/Resources";
import { Scene } from "three";

interface MenuButton {
  label: string;
  helpText: string;
  index?: number;
  onClick: () => void;
}

enum ScreenSize {
  Small,
  Medium,
  Large,
}

const Z_INDEX = 5;
const BUTTON_DELAY = 25;

export class BaseMenu {
  private radarSprite: UISprite;
  private menuButtons: Button[] = [];

  constructor(
    protected resources: VirtualFileSystem,
    protected graphics: GraphicsManager,
    protected i18n: Internationalization,
    protected audio: AudioManager,
    private readonly title: string,
    private readonly buttons: MenuButton[]
  ) {
    const buttonBackgroundFile = resources.getFile('sdbtnbkgd.shp');
    const buttonFile = resources.getFile('sdbtnanm.shp');
    const radarFile = resources.getFile('sdtp.shp');
    const paletteFile = resources.getFile('sdbtnanm.pal');
    const shellPaletteFile = resources.getFile('shell.pal');
    if (buttonFile === null || paletteFile === null || radarFile === null || shellPaletteFile === null || buttonBackgroundFile === null) {
      throw new Error('Unable to load menu graphics');
    }
    graphics.clearUI();
    const palette = Palette.fromArray(paletteFile);
    const shellPalette = Palette.fromArray(shellPaletteFile);
    const buttonMaterial = new SpriteMaterial(Shp.fromArray(buttonFile), palette);
    const buttonCount = this.maxButtons;
    const boundingBox = this.boundingBox;

    const radarMaterial = new SpriteMaterial(Shp.fromArray(radarFile), shellPalette);
    this.radarSprite = new UISprite(radarMaterial, 0);
    graphics.trackUIDrawable(this.radarSprite);

    const titleLabel = new Text(i18n.getString(title), 8, 0xFFFF00);
    titleLabel.position.set(boundingBox.bottomRight.x - 80 - titleLabel.width / 2, boundingBox.topLeft.y - 23, Z_INDEX + 1);
    graphics.trackUIDrawable(titleLabel);

    const buttonBackgroundMaterial = new SpriteMaterial(Shp.fromArray(buttonBackgroundFile), palette);
    for (let i = 0; i < buttonCount; i++) {
      let btn: MenuButton | undefined = undefined;
      if (buttons[i] !== undefined && (buttons[i].index === i || buttons[i].index === undefined)) {
        btn = buttons[i];
      } else if (buttons.find(({ index }) => ((index !== undefined && index < 0) ? buttonCount + index : index) === i) !== undefined) {
        btn = buttons.find(({ index }) => ((index !== undefined && index < 0) ? buttonCount + index : index) === i);
      }
      const buttonBackground = new UISprite(buttonBackgroundMaterial, 0);
      const button = new Button(i18n.getString(btn?.label ?? ''), buttonMaterial, 10);
      button.setLabelVisibility(false);
      button.disabled = (btn === undefined);

      buttonBackground.setPos(boundingBox.bottomRight.x - buttonBackgroundMaterial.frameWidth(0), boundingBox.topLeft.y - radarMaterial.frameHeight(0) - ((i + 1) * 42), Z_INDEX);
      button.setPos(boundingBox.bottomRight.x - buttonMaterial.frameWidth(0), boundingBox.topLeft.y - radarMaterial.frameHeight(0) - ((i + 1) * 42), Z_INDEX);
      if (btn?.onClick) {
        button.onClick(() => audio.playSound('MenuClick'));
        button.onClick(btn.onClick);
      }
      graphics.trackUIDrawable(buttonBackground);
      graphics.trackUIDrawable(button);
      this.menuButtons.push(button);
    }

    this.delayedButtonAnimation(true);
    this.renderRadar();

    audio.playSound('MenuSlideIn');
  }

  public removeFromScene(scene: Scene) {
    this.menuButtons.forEach((btn) => btn.removeFromScene(scene))
  }

  private renderRadar() {
    const boundingBox = this.boundingBox;
    const material = this.radarSprite.material;
    this.radarSprite.setPos(boundingBox.bottomRight.x - material.frameWidth(0), boundingBox.topLeft.y - material.frameHeight(0), Z_INDEX);
  }

  protected changeScreen(nextScreen: ScreenConstructable) {
    this.audio.playSound('MenuSlideOut');
    this.delayedButtonAnimation(false).then(() => this.graphics.setScreen(new nextScreen(this.resources, this.graphics, this.i18n, this.audio)));
  }

  private delayedButtonAnimation(forwards: boolean): Promise<void> {
    return new Promise((resolve) => {
      let animatedCount = 0;
      const buttonAnimationInterval = setInterval(() => {
        const button = this.menuButtons[animatedCount];
        const isBlank = button.disabled;
        const start = forwards ? (isBlank ? 16 : 10) : (isBlank ? 5 : 11);
        button.setLabelVisibility(false);
        button.disabled = true;
        button.animateSequence({ directionOffset: 0, offset: start, nextFrameOffset: forwards ? -1 : 1, frameCount: 6 }, BUTTON_DELAY)
          .then(() => button.setCurrentFrame(forwards ? (isBlank ? 0 : 2) : 10))
          .then(() => button.setLabelVisibility(forwards ? true : false))
          .then(() => button.disabled = forwards ? isBlank : true);
          animatedCount++;
          if (animatedCount >= this.menuButtons.length) {
            clearInterval(buttonAnimationInterval);
            resolve();
          }
      }, BUTTON_DELAY * 2);
    });
  }

  protected get size() {
    const height = this.graphics.resolution.height;
    if (height < 632) {
      return ScreenSize.Small;
    } else if (height < 736) {
      return ScreenSize.Medium;
    }
    return ScreenSize.Large;
  }

  private get boundingBox() {
    const resolution = this.graphics.resolution;

    let width: number;
    let height: number;
    if (this.size === ScreenSize.Small) {
      width = 648;
      height = 512;
    } else {
      width = 800
      height = 632;
    }
    const halfWidth = resolution.width / 2;
    const halfHeight = resolution.height / 2;
    const topLeft = { x: halfWidth - width / 2, y: halfHeight + (height / 2) };
    const bottomRight = { x: halfWidth + width / 2, y: halfHeight - height / 2 };
    return { topLeft, bottomRight };
  }

  private get maxButtons() {
    const size = this.size;
    if (size === ScreenSize.Large) {
      return 9;
    } else if (size === ScreenSize.Medium) {
      return 7;
    }
    return 5;
  }
}