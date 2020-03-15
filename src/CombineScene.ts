import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Fade from "./Fade";
import GameManager from "./GameManager";
import LoaderAddParam from "./LoaderAddParam";
import Resource from "./Resources";
import Sound from "./Sound";
import Country from "./Country";
import Flag from "./Flag";
import Circle from "./Circle";

export default class CombineScene extends Scene {
  private sound: Sound | null = null;
  public sidebar: PIXI.Graphics;
  public circle: Circle;
  private sidebarFlags = new Array<Country>();
  private progressText: PIXI.Text;

  private get flagMargin(): number {
    return Flag.maxHeight * 0.1;
  }

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
    this.progressText = new PIXI.Text(
      "0/" + GameManager.instance.countries.size.toString(),
      new PIXI.TextStyle({
        fontSize: 96,
        fill: 0x000000,
        padding: 6
      })
    );
    this.progressText.anchor.set(0.5, 0.5);
    this.progressText.position.set(
      renderer.width * 0.65,
      renderer.height * 0.9
    );
    this.addChild(this.progressText);
  }

  //リソースリストを作成し返却する
  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    let assets = super.createInitialResourceList();
    const staticResource = Resource.Static;
    assets.push(staticResource.Magic);
    assets.push(staticResource.Audio.Bgm.CombineScene);
    assets.push(staticResource.Audio.SE.onCircle);
    assets.push(staticResource.Audio.SE.onCombine);
    GameManager.instance.countries.forEach((country: Country) =>
      assets.push(country.img)
    );
    return assets;
  }

  //リソースがロードされたときのコールバック
  protected onResourceLoaded(): void {
    super.onResourceLoaded();
    const resources = GameManager.instance.game.loader.resources;

    //魔法陣を表示
    this.circle = new Circle(this, resources[Resource.Static.Magic].texture);
    this.addChild(this.circle);

    //サイドバーに国旗を表示
    this.createSidebar();
  }

  public createSidebar() {
    if (this.sidebar) {
      //既にサイドバーを生成していたら
      this.sidebar.destroy();
    }
    const renderer = GameManager.instance.game.renderer;

    //背景色を設定
    this.sidebar = new PIXI.Graphics();
    this.sidebar.x = renderer.width * 0.8;
    const sidebarWidth = renderer.width - this.sidebar.x;
    this.sidebar.beginFill(0x7fff7f);
    this.sidebar.drawRect(0, 0, sidebarWidth, renderer.height);
    this.addChild(this.sidebar);

    //旗を追加
    const resources = GameManager.instance.game.loader.resources;
    this.sidebarFlags = [];
    GameManager.instance.countries.forEach(country => {
      if (!country.isOwn) return;
      this.sidebarFlags.push(country);
    });

    //旗の縦幅を決定
    Flag.maxHeight = Math.min(
      100,
      (this.sidebar.height / this.sidebarFlags.length) * 0.9 + 0.1
    );

    //所持数更新
    this.progressText.text =
      this.sidebarFlags.length.toString() +
      "/" +
      GameManager.instance.countries.size.toString();

    let i = 0;
    for (const country of this.sidebarFlags) {
      const flag = new Flag(country, resources[country.img].texture);
      flag.scene = this;
      flag.setDraggable(true, country.id);
      flag.setOriginalPos(
        this.sidebar.width / 2,
        i * Flag.maxHeight + (i + 1) * this.flagMargin + Flag.maxHeight * 0.5
      );
      this.sidebar.addChild(flag);
      i++;
      //i++;
    }
  }

  public onKingdomOfYugoslavia() {
    const resources = GameManager.instance.game.loader.resources;
    //BGMを再生
    this.sound = new Sound(
      (resources[Resource.Static.Audio.Bgm.CombineScene] as any).buffer
    );
    this.sound.volume = 0.25;
    this.sound.play(false);
  }
  public update(dt: number) {
    super.update(dt);
  }
}
