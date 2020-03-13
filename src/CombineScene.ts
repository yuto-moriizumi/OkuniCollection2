import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Fade from "./Fade";
import GameManager from "./GameManager";
import LoaderAddParam from "./LoaderAddParam";
import Resource from "./Resources";
import Sound from "./Sound";
import * as Filters from "pixi-filters";
import Country from "./Country";

export default class CombineScene extends Scene {
  private sound: Sound | null = null;
  private sidebar: PIXI.Graphics;
  private circle: PIXI.Sprite;
  private sidebarPadding: number = 40;
  private flagHeight: number = 100;
  private flagMarginTop: number = 30;
  private flagFirstX: number = 0;
  private flagFirstY: number = 0;
  private circleChildren: Array<number>;

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
    GameManager.instance.countries.forEach((country: Country) =>
      assets.push(country.img)
    );
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
    this.circle = new PIXI.Sprite(resources[Resource.Static.Magic].texture);
    this.circle.anchor.set(0.5, 0.5);
    this.circle.x = renderer.width * 0.3;
    this.circle.y = renderer.height * 0.5;
    this.addChild(this.circle);

    //サイドバーに国旗を表示
    let i = 0;
    GameManager.instance.countries.forEach((country, id) => {
      if (!country.isOwn) return;
      //});
      //for (let i = 0; i < GameManager.instance.countries.size; i++) {

      const sprite = new PIXI.Sprite(resources[country.img].texture);
      sprite.scale.set(
        (this.sidebar.width - this.sidebarPadding * 2) / sprite.width
      );
      sprite.x = this.sidebarPadding;
      sprite.y = i * this.flagHeight + this.flagMarginTop;
      sprite.buttonMode = true;
      sprite.interactive = true;
      sprite.on("mousedown", (e: PIXI.interaction.InteractionEvent) =>
        this.onFlagClicked(e, id)
      );
      this.sidebar.addChild(sprite);
      i++;
    });
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
    sprite.on("mousemove", (e: PIXI.interaction.InteractionEvent) =>
      this.onFlagMove(e, id)
    );
    sprite.on("mouseup", (e: PIXI.interaction.InteractionEvent) =>
      this.onFlagUp(e, id)
    );
  }

  private onFlagMove(e: PIXI.interaction.InteractionEvent, id: number) {
    const sprite = e.currentTarget as PIXI.Sprite;
    const position = e.data.getLocalPosition(this);
    sprite.x = position.x - this.flagFirstX;
    sprite.y = position.y - this.flagFirstY;
  }

  private onFlagUp(e: PIXI.interaction.InteractionEvent, id: number) {
    console.log("flagmove");
    const sprite = e.currentTarget as PIXI.Sprite;
    sprite.off("mousemove");
    sprite.off("mouseup");
    sprite.on("mousedown", (e: PIXI.interaction.InteractionEvent) =>
      this.onFlagClicked(e, id)
    );

    //魔法陣の中に入ったか計算
    const circleCenterX = this.circle.x;
    const circleCenterY = this.circle.y;
    //const circleCenterX = this.circle.x + this.circle.width / 2;
    //const circleCenterY = this.circle.y + this.circle.height / 2;
    const radius = Math.max(this.circle.width, this.circle.height) / 2;
    console.log([circleCenterX, circleCenterY, radius]);
    if (
      Math.pow(sprite.x - circleCenterX, 2) +
        Math.pow(sprite.y - circleCenterY, 2) <=
      Math.pow(radius, 2)
    ) {
      //魔法陣の中に入っていたら
      console.log("inCircle!");
      const position = e.data.getLocalPosition(this.circle);
      sprite.setParent(this.circle);
      sprite.x = position.x - this.flagFirstX;
      sprite.y = position.y - this.flagFirstY;
      sprite.filters = [
        new Filters.GlowFilter({
          distance: 15,
          outerStrength: 8,
          color: 0xffff00
        })
      ];
      this.circleChildren.push(id);

      //合成判定
      this.circleChildren = this.circleChildren.sort();
      GameManager.instance.countries.forEach(country => {
        if (this.circleChildren.length !== country.from.length) return;
        country.from = country.from.sort();
        for (let i = 0; i < this.circleChildren.length; i++) {
          if (country.from[i] !== this.circleChildren[i]) return;
        }
        
      });
    }
  }
}
