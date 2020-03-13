import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Fade from "./Fade";
import GameManager from "./GameManager";
import LoaderAddParam from "./LoaderAddParam";
import Resource from "./Resources";
import Sound from "./Sound";

export default class CombineScene extends Scene {
  private sound: Sound | null = null;

  constructor() {
    super();
    this.transitionIn = new Fade(1.0, 0.0, -0.02);
    this.transitionOut = new Fade(0.0, 1.0, 0.02);

    const renderer = GameManager.instance.game.renderer;

    //背景色を設定
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, renderer.width, renderer.height);
    this.addChild(graphics);
  }

  //リソースリストを作成し返却する
  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    let assets = super.createInitialResourceList();
    const staticResource = Resource.Static;
    assets.push(staticResource.Magic);
    return assets;
  }

  //リソースがロードされたときのコールバック
  protected onResourceLoaded(): void {
    super.onResourceLoaded();
    const resources = GameManager.instance.game.loader.resources;

    //BGMを再生
    this.sound = new Sound(
      (resources[Resource.Static.Audio.Bgm.Title] as any).buffer
    );
    this.sound.volume = 0.25;
    this.sound.play();

    //魔法陣を表示
    const circle = new PIXI.Sprite(resources[Resource.Static.Magic].texture);
    circle.transform();
    this.addChild(circle);
  }

  public update(dt: number) {
    super.update(dt);
  }
}
