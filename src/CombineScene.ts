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
  public mushimegane: PIXI.Sprite;
  private sidebarFlags = new Array<Country>();
  private progressText: PIXI.Text;
  private sidebarRows = 1;
  private readonly MAX_LINES = 13;
  private readonly SIDEBAR_WIDTH_RATIO = 0.25;
  private readonly FLAG_MARGIN_RATIO = 0.1;

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
    this.progressText.position.set(renderer.width * 0.6, renderer.height * 0.9);
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
    assets.push(staticResource.Audio.SE.onClear);
    assets.push(staticResource.Mushimegane);
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

    //虫眼鏡を表示
    this.mushimegane = new PIXI.Sprite(
      resources[Resource.Static.Mushimegane].texture
    );

    const renderer = GameManager.instance.game.renderer;
    this.mushimegane.position.set(renderer.width * 0.6, renderer.height * 0.15);
    this.mushimegane.anchor.set(0.5, 0.5);
    this.mushimegane.scale.set(100 / this.mushimegane.width);
    this.addChild(this.mushimegane);

    //サイドバーを生成
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
    this.sidebar.x = renderer.width * (1 - this.SIDEBAR_WIDTH_RATIO);
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

    //列数を決定
    this.sidebarRows = Math.ceil(this.sidebarFlags.length / this.MAX_LINES);

    //クリア判定
    if (this.sidebarFlags.length === GameManager.instance.countries.size) {
      const resources = GameManager.instance.game.loader.resources;
      //SEを再生
      const sound = new Sound(
        (resources[Resource.Static.Audio.SE.onClear] as any).buffer
      );
      sound.volume = 0.3;
      sound.play(false);

      const text = new PIXI.Text(
        "ゲームクリア！",
        new PIXI.TextStyle({
          fontFamily: "MisakiGothic",
          fontSize: 128,
          fill: 0x000000,
          padding: 6
        })
      );
      text.anchor.set(0.5, 0.5);
      const renderer = GameManager.instance.game.renderer;
      text.position.set(renderer.width / 2, renderer.height / 2);
      this.addChild(text);
    }

    //旗の縦幅を決定
    Flag.maxHeight = Math.min(
      100,
      (this.sidebar.height /
        Math.min(this.sidebarFlags.length, this.MAX_LINES)) *
        (1 - this.FLAG_MARGIN_RATIO) +
        this.FLAG_MARGIN_RATIO
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
        (this.sidebar.width / (this.sidebarRows + 1)) *
          (Math.floor(i / this.MAX_LINES) + 1),
        (i % this.MAX_LINES) * (Flag.maxHeight + this.flagMargin) +
          this.flagMargin +
          Flag.maxHeight * 0.5
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

  public onMushimegane(flag: Flag) {
    if (flag.country.id === -1) return; //ハンマーの場合は何もしない
    console.log(flag.country.wikipedia);
    window.open(flag.country.wikipedia);
  }
}
