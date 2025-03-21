import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Country from "./Country";
import { Application, Assets } from "pixi.js";

export default class GameManager {
  public static instance: GameManager;
  public game!: PIXI.Application;
  private sceneTransitionOutFinished: boolean = true;
  private currentScene?: Scene;
  private sceneResourceLoaded: boolean = true;
  public countries = new Map<number, Country>();

  constructor(app: PIXI.Application) {
    if (GameManager.instance) {
      throw new Error("GameManager can be instantiate only once");
    }
    this.game = app;
  }

  public static async start(params: {
    glWidth: number;
    glHeight: number;
    backgroundColor: number;
  }) {
    const game = new Application();
    await game.init({
      width: params.glWidth,
      height: params.glHeight,
      backgroundColor: params.backgroundColor,
    });
    //PIXI.ApplicationインスタンスのloaderプロパティにbaseUrlを設定
    await Assets.init({ basePath: "assets/" });
    GameManager.instance = new GameManager(game);
    document.body.appendChild(game.canvas);
    game.ticker.add(({ deltaMS }) => {
      if (this.instance.currentScene) {
        this.instance.currentScene.update(deltaMS);
      }
    });

    //国情報をロード
    const req = new XMLHttpRequest();
    req.open("GET", "countries.json");
    req.send(null);
    req.addEventListener("load", () => {
      //console.log("json loaded");
      const json = JSON.parse(req.responseText);
      for (const key in json) {
        const country = json[key];
        const id = parseInt(key);
        this.instance.countries.set(id, new Country(id, country));
      }
      //console.log(GameManager.instance.countries);
    });
    req.addEventListener("error", () => console.log("json error"));
  }

  //可能であれば新しいシーンへのトランジションを開始する
  public static transitionInIfPossible(newScene: Scene): boolean {
    const instance = GameManager.instance;
    if (!instance.sceneTransitionOutFinished || !instance.sceneResourceLoaded) {
      //リソースロードとトランジション終了のどちらかが未完了ならトランジションを開始しない
      return false;
    }
    if (instance.currentScene) {
      instance.currentScene.destroy();
    }
    instance.currentScene = newScene;
    if (instance.game) {
      instance.game.stage.addChild(newScene);
    }
    newScene.beginTransitionIn(() => {});
    return true;
  }

  //シーンをロードする
  //新しいシーンのリソース読み込みと、古いシーンのトランジションを同時に開始する
  //いずれも完了したら、新しいシーンのトランジションを開始する
  public static async loadScene(newScene: Scene) {
    const instance = GameManager.instance;
    if (instance.currentScene) {
      //現在のシーンがセットされているなら
      instance.sceneResourceLoaded = false;
      instance.sceneTransitionOutFinished = false;

      await newScene.beginLoadResource();
      instance.sceneResourceLoaded = true;
      GameManager.transitionInIfPossible(newScene);
      newScene.onResourceLoaded();

      instance.currentScene.beginTransitionOut(() => {
        instance.sceneTransitionOutFinished = true;
        GameManager.transitionInIfPossible(newScene);
      });
    } else {
      instance.sceneTransitionOutFinished = true;
      await newScene.beginLoadResource();
      instance.sceneResourceLoaded = true;
      GameManager.transitionInIfPossible(newScene);
      newScene.onResourceLoaded();
    }
  }
}
