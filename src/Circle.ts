import * as PIXI from "pixi.js";
import GameManager from "./GameManager";
import Flag from "./Flag";
import * as Filters from "pixi-filters";
import Country from "./Country";
import CombineScene from "./CombineScene";
import Sound from "./Sound";
import Resource from "./Resources";

export default class Circle extends PIXI.Sprite {
  private flags: Set<Flag> = new Set<Flag>();
  private combineList = new Array<Flag>();
  public scene: CombineScene;

  constructor(scene: CombineScene, texture?: PIXI.Texture) {
    super(texture);

    this.scene = scene;

    //初期位置を設定
    const renderer = GameManager.instance.game.renderer;
    this.anchor.set(0.5, 0.5);
    this.x = renderer.width * 0.3;
    this.y = renderer.height * 0.5;
  }

  public addFlag(flag: Flag, combine: boolean = true, position?: PIXI.Point) {
    if (this.flags.has(flag)) return;
    flag.setParent(this);
    this.flags.add(flag);
    if (position) {
      flag.x = position.x - flag.flagFirstX;
      flag.y = position.y - flag.flagFirstY;
    }
    flag.filters = [
      new Filters.GlowFilter({
        distance: 15,
        outerStrength: 8,
        color: 0xffff00
      })
    ];

    if (!combine) return; //合成モードがONでないなら終了

    const resources = GameManager.instance.game.loader.resources;
    //BGMを再生
    const sound = new Sound(
      (resources[Resource.Static.Audio.SE.onCircle] as any).buffer
    );
    sound.volume = 0.25;
    sound.play(false);

    //合成判定
    let isCombined = false;
    GameManager.instance.countries.forEach(country => {
      //魔法陣内の旗とレシピが一致するか確認
      if (this.flags.size !== country.from.length) return;
      let isCombinable = true;
      this.flags.forEach(flag => {
        if (!country.from.includes(flag.country.id)) {
          isCombinable = false;
          return;
        }
      });
      if (isCombinable) {
        this.combineCountry(country);
        isCombined = true;
      }
    });
    if (isCombined) {
      //魔法陣にある旗を消去
      this.flags.forEach(flag => {
        this.flags.delete(flag);
        flag.destroy();
      });
      //錬成リストにある旗を魔法陣に追加
      for (const flag of this.combineList) {
        this.addFlag(flag, false);
        if (flag.country.id === 20) this.scene.onKingdomOfYugoslavia(); //ユーゴスラビア王国
      }
      this.combineList = [];
      this.scene.createSidebar();
    }
  }

  private combineCountry(country: Country) {
    console.log(["combine:", country.name]);
    //合成する
    const resources = GameManager.instance.game.loader.resources;
    const newCountry = new Flag(country, resources[country.img].texture);
    newCountry.anchor.set(0.5, 0.5);
    const raidus = Math.max(this.width, this.height);
    newCountry.position.set(
      (Math.random() - 0.5) * raidus * 0.9,
      (Math.random() - 0.5) * raidus * 0.9
    );
    newCountry.setDraggable(true, country.id);
    newCountry.scene = this.scene;
    GameManager.instance.countries.get(country.id).isOwn = true;
    this.combineList.push(newCountry);
  }

  public removeFlag(flag: Flag) {
    this.flags.delete(flag);
    flag.filters = [];
    flag.setParent(this.scene);
  }
}
