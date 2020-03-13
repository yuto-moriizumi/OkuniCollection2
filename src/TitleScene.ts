import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Fade from "./Fade";
import GameManager from "./GameManager";
import LoaderAddParam from "./LoaderAddParam";
import Resource from "./Resources";
import Sound from "./Sound";

export default class TitleScene extends Scene {
  private text!: PIXI.Text;
  private sound: Sound | null = null;
  private readonly textAppealDuration: number = 200;

  constructor() {
    super();
    this.transitionIn = new Fade(1.0, 0.0, -0.02);
    this.transitionOut = new Fade(0.0, 1.0, 0.02);
  }

  //リソースリストを作成し返却する
  protected createInitialResourceList(): (LoaderAddParam | string)[] {
    let assets = super.createInitialResourceList();
    const staticResource = Resource.Static;
    assets = assets.concat(staticResource.BattleBgFores.slice(0, 1));
    assets = assets.concat(staticResource.BattleBgMiddles.slice(0, 1));
    assets = assets.concat(staticResource.BattleBgBacks.slice(0, 1));
    assets.push(staticResource.Audio.Bgm.Title);
    console.log(assets);
    return assets;
  }

  //リソースがロードされたときのコールバック
  protected onResourceLoaded(): void {
    super.onResourceLoaded();
    const resources = GameManager.instance.game.loader.resources;
    const bgOrder = [
      Resource.Static.BattleBgBacks,
      Resource.Static.BattleBgMiddles,
      Resource.Static.BattleBgFores
    ];
    for (const bgs of bgOrder) {
      for (let i = 0; i < bgs.length; i++) {
        try {
          const sprite = new PIXI.Sprite(resources[bgs[i]].texture);
          sprite.position.set(sprite.width * i, 0);
          this.addChild(sprite);
        } catch (error) {
          console.log([bgs, i, error]);
          console.log(resources);
        }
      }
    }
    const renderer = GameManager.instance.game.renderer;
    this.text = new PIXI.Text(
      "TOUCH TO START",
      new PIXI.TextStyle({
        fontFamily: "MisakiGothic",
        fontSize: 64,
        fill: 0xffffff,
        padding: 12
      })
    );
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(renderer.width * 0.5, renderer.height * 0.5);
    this.addChild(this.text);
    this.interactive = true;
    this.on("pointerup", () => this.showOrderScene());

    this.sound = new Sound(
      (resources[Resource.Static.Audio.Bgm.Title] as any).buffer
    );
    this.sound.volume = 0.25;
  }

  //タップされたときのコールバック
  public showOrderScene(): void {
    console.log("should go to order scene");
    if (this.sound && this.sound.isPlayed)
      this.sound.isPaused ? this.sound.resume() : this.sound.pause();
    if (!this.sound.isPlayed) this.sound.play();
  }

  public update(dt: number) {
    super.update(dt);
    if (this.elapsedFrameCount % this.textAppealDuration === 0)
      this.text.visible = !this.text.visible;
  }
}
