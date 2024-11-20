import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Fade from "./Fade";
import GameManager from "./GameManager";
import Resource from "./Resources";
import CombineScene from "./CombineScene";
import { Assets } from "pixi.js";

export default class TitleScene extends Scene {
  private text!: PIXI.Text;
  private readonly textAppealDuration: number = 150;

  constructor() {
    super();
    this.transitionIn = new Fade(1.0, 0.0, -0.02);
    this.transitionOut = new Fade(0.0, 1.0, 0.02);
  }

  //リソースリストを作成し返却する
  protected createInitialResourceList(): string[] {
    const assets = super.createInitialResourceList();
    const staticResource = Resource.Static;
    assets.push(staticResource.Audio.Bgm.Title);
    assets.push(staticResource.Title.Bg);
    console.log(assets);
    return assets;
  }

  //リソースがロードされたときのコールバック
  public onResourceLoaded(): void {
    super.onResourceLoaded();
    const renderer = GameManager.instance.game.renderer;

    //背景
    const sprite = new PIXI.Sprite(Assets.get(Resource.Static.Title.Bg));
    sprite.width = renderer.width;
    sprite.height = renderer.height;
    this.addChild(sprite);

    const text = new PIXI.Text(
      "オクニコレクション２",
      new PIXI.TextStyle({
        fontFamily: "MisakiGothic",
        fontSize: 110,
        fill: 0xffffff,
        padding: 12,
        dropShadow: true,
      }),
    );
    text.anchor.set(0.5, 0.5);
    text.position.set(renderer.width * 0.5, renderer.height * 0.4);
    this.addChild(text);

    this.text = new PIXI.Text(
      "TOUCH TO START",
      new PIXI.TextStyle({
        fontFamily: "MisakiGothic",
        fontSize: 64,
        fill: 0xffffff,
        padding: 12,
      }),
    );
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(renderer.width * 0.5, renderer.height * 0.6);
    this.addChild(this.text);
    this.interactive = true;
    this.cursor = "pointer";
    this.on("pointerdown", () => this.onPointerDown());
  }

  private onPointerDown() {
    GameManager.loadScene(new CombineScene());
  }

  public update(dt: number) {
    super.update(dt);
    if (this.elapsedFrameCount % this.textAppealDuration === 0)
      this.text.visible = !this.text.visible;
  }
}
