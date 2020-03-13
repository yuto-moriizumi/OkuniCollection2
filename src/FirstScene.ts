import * as PIXI from "pixi.js";
import Scene from "./Scene";
import GameManager from "./GameManager";
import SecondScene from "./SecondScene";
import Transition from "./Transition";
import Fade from "./Fade";

export default class FirstScene extends Scene {
  protected transitionIn: Transition = new Fade(1.0, 0.0, -0.01);
  protected transitionOut: Transition = new Fade(0.0, 1.0, 0.01);
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
    this.text.text = `first scene \n${this.count++}`;
  }

  public nextScene(): void {
    GameManager.loadScene(new SecondScene());
  }
}
