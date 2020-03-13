import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Fade from "./Fade";
import GameManager from "./GameManager";
import LoaderAddParam from "./LoaderAddParam";
import Resource from "./Resources";
import Sound from "./Sound";

export default class CombineScene extends Scene {
  private sound: Sound | null = null;
  private sidebar: PIXI.Graphics;
  private sidebarPadding: number = 40;
  private flagHeight: number = 100;
  private flagMarginTop: number = 30;
  private flagFirstX: number = 0;
  private flagFirstY: number = 0;

  constructor() {
    super();
    this.transitionIn = new Fade(1.0, 0.0, -0.02);
    this.transitionOut = new Fade(0.0, 1.0, 0.02);

    const renderer = GameManager.instance.game.renderer;

    //背景色を設定
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffcf);
    graphics.drawRect(0, 0, renderer.width, renderer.height);
    this.addChild(graphics);

    //サイドバーを表示
    this.sidebar = new PIXI.Graphics();
    this.sidebar.x = renderer.width * 0.8;
    const sidebarWidth = renderer.width - this.sidebar.x;
    this.sidebar.beginFill(0x7fff7f);
    this.sidebar.drawRect(0, 0, sidebarWidth, renderer.height);
    this.addChild(this.sidebar);
  }

  //リソースリストを作成し返却する
  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    let assets = super.createInitialResourceList();
    const staticResource = Resource.Static;
    assets.push(staticResource.Magic);
    for (const country of GameManager.instance.countries) {
      assets.push(country.img);
    }
    return assets;
  }

  //リソースがロードされたときのコールバック
  protected onResourceLoaded(): void {
    super.onResourceLoaded();
    const resources = GameManager.instance.game.loader.resources;
    const renderer = GameManager.instance.game.renderer;

    //BGMを再生
    this.sound = new Sound(
      (resources[Resource.Static.Audio.Bgm.Title] as any).buffer
    );
    this.sound.volume = 0.25;
    //this.sound.play();

    //魔法陣を表示
    const circle = new PIXI.Sprite(resources[Resource.Static.Magic].texture);
    circle.anchor.set(0.5, 0.5);
    circle.x = renderer.width * 0.3;
    circle.y = renderer.height * 0.5;
    this.addChild(circle);

    //サイドバーに国旗を表示
    for (let i = 0; i < GameManager.instance.countries.length; i++) {
      const country = GameManager.instance.countries[i];
      const sprite = new PIXI.Sprite(resources[country.img].texture);
      sprite.scale.set(
        (this.sidebar.width - this.sidebarPadding * 2) / sprite.width
      );
      sprite.x = this.sidebarPadding;
      sprite.y = i * this.flagHeight + this.flagMarginTop;
      sprite.buttonMode = true;
      sprite.interactive = true;
      sprite.on("mousedown", (e: PIXI.interaction.InteractionEvent) =>
        this.onFlagClicked(e, i)
      );
      this.sidebar.addChild(sprite);
    }
  }

  public update(dt: number) {
    super.update(dt);
  }

  private onFlagClicked(e: PIXI.interaction.InteractionEvent, id: number) {
    const sprite = e.currentTarget as PIXI.Sprite;
    console.log("flag!");
    sprite.off("mousedown");
    const localPosition = e.data.getLocalPosition(sprite);
    const position = e.data.getLocalPosition(this);
    this.sidebar.removeChild(sprite);
    this.addChild(sprite);
    sprite.x = position.x - localPosition.x * sprite.scale.x;
    sprite.y = position.y - localPosition.y * sprite.scale.y;
    this.flagFirstX = localPosition.x * sprite.scale.x;
    this.flagFirstY = localPosition.y * sprite.scale.y;
    console.log(["moveto", sprite.x, sprite.y]);
    sprite.on("mousemove", e => this.onFlagMove(e, id));
    sprite.on("mouseup", e => this.onFlagUp(e, id));
  }

  private onFlagMove(e, id: number) {
    console.log("flagmove");
    const sprite = e.currentTarget as PIXI.Sprite;
    const localPosition = e.data.getLocalPosition(sprite);
    const position = e.data.getLocalPosition(this);
    sprite.x = position.x - this.flagFirstX;
    sprite.y = position.y - this.flagFirstY;
  }

  private onFlagUp(e, id: number) {
    console.log("flagmove");
    const sprite = e.currentTarget as PIXI.Sprite;
    sprite.off("mousemove");
    sprite.off("mouseup");
    sprite.on("mousedown", e => this.onFlagClicked(e, id));
  }
}
