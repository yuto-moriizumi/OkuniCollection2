import * as PIXI from "pixi.js";
import CombineScene from "./CombineScene";
import Country from "./Country";

export default class Flag extends PIXI.Sprite {
  public flagFirstX: number;
  public flagFirstY: number;
  public scene: CombineScene;
  public static maxHeight: number = 100;
  public country: Country;

  constructor(country: Country, texture?: PIXI.Texture) {
    super(texture);
    this.country = country;
    this.anchor.set(0.5, 0.5);
    if (texture) this.setScale();
  }

  public setScale() {
    const multiplier = Flag.maxHeight / this.height;
    this.scale.set(multiplier);
  }

  public setOriginalPos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setDraggable(boolean: boolean, id: number) {
    if (boolean) {
      this.buttonMode = true;
      this.interactive = true;
      this.on("mousedown", (e: PIXI.InteractionEvent) =>
        this.onFlagClicked(e, id),
      );
    }
  }

  public onFlagClicked(e: PIXI.InteractionEvent, id: number) {
    const sprite = e.currentTarget as PIXI.Sprite;
    sprite.off("mousedown");
    const localPosition = e.data.getLocalPosition(sprite);
    const position = e.data.getLocalPosition(this.scene);
    sprite.setParent(this.scene);
    sprite.x = position.x - localPosition.x * sprite.scale.x;
    sprite.y = position.y - localPosition.y * sprite.scale.y;
    this.flagFirstX = localPosition.x * sprite.scale.x;
    this.flagFirstY = localPosition.y * sprite.scale.y;
    //console.log(["moveto", sprite.x, sprite.y]);
    sprite.on("mousemove", (e: PIXI.InteractionEvent) => this.onFlagMove(e));
    sprite.on("mouseup", (e: PIXI.InteractionEvent) => this.onFlagUp(e, id));
  }

  private onFlagMove(e: PIXI.InteractionEvent) {
    const sprite = e.currentTarget as PIXI.Sprite;
    const position = e.data.getLocalPosition(this.scene);
    sprite.x = position.x - this.flagFirstX;
    sprite.y = position.y - this.flagFirstY;
  }

  private onFlagUp(e: PIXI.InteractionEvent, id: number) {
    const sprite = e.currentTarget as PIXI.Sprite;
    sprite.off("mousemove");
    sprite.off("mouseup");
    sprite.on("mousedown", (e: PIXI.InteractionEvent) =>
      this.onFlagClicked(e, id),
    );

    //魔法陣の中に入ったか計算
    const circleCenterX = this.scene.circle.x;
    const circleCenterY = this.scene.circle.y;
    const radius =
      Math.max(this.scene.circle.width, this.scene.circle.height) / 2;
    if (
      Math.pow(sprite.x - circleCenterX, 2) +
        Math.pow(sprite.y - circleCenterY, 2) <=
      Math.pow(radius, 2)
    ) {
      //魔法陣の中に入っていたら
      this.scene.circle.addFlag(
        this,
        true,
        e.data.getLocalPosition(this.scene.circle),
      );
      return;
    }
    //入っていなかったら
    this.scene.circle.removeFlag(this);

    //虫眼鏡の上にあるか計算
    const mushimeganeX = this.scene.mushimegane.x;
    const mushimeganeY = this.scene.mushimegane.y;
    const mushimeganeRadius =
      Math.max(this.scene.mushimegane.width, this.scene.mushimegane.height) / 2;
    if (
      Math.pow(sprite.x - mushimeganeX, 2) +
        Math.pow(sprite.y - mushimeganeY, 2) <=
      Math.pow(mushimeganeRadius, 2)
    ) {
      //入っていたら
      this.scene.onMushimegane(this);
      return;
    }
  }
}
