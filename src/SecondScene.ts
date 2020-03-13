import * as PIXI from "pixi.js";
import Scene from "./Scene";
import GameManager from "./GameManager";
import FirstScene from "./FirstScene";
import LoaderAddParam from "./LoaderAddParam";

export default class SecondScene extends Scene {
  private text!: PIXI.Text;
  private count: number = 0;
  constructor() {
    super();
    const renderer = GameManager.instance.game.renderer;
    this.text = new PIXI.Text(
      "second scene",
      new PIXI.TextStyle({
        fontSize: 64,
        fill: 0xffffff
      })
    );
    this.text.interactive = true;
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(renderer.width * 0.5, renderer.height * 0.5);
    this.text.on("pointerdown", this.nextScene);
    this.addChild(this.text);
  }
  //メインループ
  //表示されているテキストの更新を行う
  public update(dt: number): void {
    super.update(dt);
    this.text.text = `second scene \n${this.count++}`;
  }

  public nextScene(): void {
    GameManager.loadScene(new FirstScene());
  }

  createInitialResourceList(): (LoaderAddParam | string)[] {
    const assets = super.createInitialResourceList();
    assets.push("assets/brazil.png");
    return assets;
  }
}
