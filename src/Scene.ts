import UpdateObject from "./UpdateObject";
import * as PIXI from "pixi.js";
import Transition from "./Transition";
import Immediate from "./Immediate";
import { Assets, Container } from "pixi.js";

export default class Scene extends Container {
  protected transitionIn: Transition = new Immediate();
  protected transitionOut: Transition = new Immediate();
  protected objectsToUpdate: UpdateObject[] = [];
  protected elapsedFrameCount: number = 0;
  /**
   * UiGraph でロードされた UI データ
   */
  protected uiGraph: { [key: string]: PIXI.Container } = {};
  /**
   * UiGraph でロードされた UI データを配置するための PIXI.Container
   * 描画順による前後関係を統制するために一つの Container にまとめる
   */
  protected uiGraphContainer: PIXI.Container = new PIXI.Container();

  //メインループで更新処理を行うべきオブジェクトの登録
  protected registerUpdatingObject(object: UpdateObject): void {
    this.objectsToUpdate.push(object);
  }
  //registerUpdatingObjectで登録されたオブジェクトのフレーム更新
  protected updateRegisteredObjects(delta: number): void {
    const nextObjectToUpdate = [];
    for (const obj of this.objectsToUpdate) {
      if (!obj || obj.isDestroyed()) continue;
      obj.update(delta);
      nextObjectToUpdate.push(obj);
    }
    this.objectsToUpdate = nextObjectToUpdate;
  }
  //シーン開始トランジション（引数は終了時のコールバック）
  public beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void {
    this.transitionIn.setCallback(() => {
      onTransitionFinished(this);
    });
    const container = this.transitionIn.getContainer();
    if (container) this.addChild(container);
    this.transitionIn.begin();
  }
  //シーン終了トランジション（引数は終了時コールバック
  public beginTransitionOut(
    onTransitionFinished: (scene: Scene) => void,
  ): void {
    this.transitionOut.setCallback(() => {
      onTransitionFinished(this);
    });
    const container = this.transitionOut.getContainer();
    if (container) this.addChild(container);
    this.transitionOut.begin();
  }

  //GameManagerによって、requestAnimationFrame毎に呼び出されるメソッド
  public update(delta: number): void {
    this.elapsedFrameCount++;
    if (this.transitionIn.isActive()) {
      this.transitionIn.update(delta);
    } else if (this.transitionOut.isActive()) {
      this.transitionOut.update(delta);
    }
  }

  //UI Graph意外に利用するリソースがある場合に派生クラスで実装する
  protected createInitialResourceList(): string[] {
    //リソースリスト取得
    return [];
  }

  public async beginLoadResource() {
    await this.loadInitialResource();
    return Assets.load(this.createInitialResourceList());
  }

  //最初に、UIGraph情報とcreateInitialResourceListで指定されたリソースをダウンロードする
  protected async loadInitialResource() {
    const assets = this.createInitialResourceList();
    return Assets.load(assets);
  }

  /**
   * onInitialResourceLoadedで発生した追加のリソースをロードする
   * @deprecated PIXI.Assetsを使用すること
   */
  protected loadAdditionalResource(
    assets: string[],
    onLoaded: () => void,
  ): void {
    Assets.load(assets).then(onLoaded);
  }

  //追加のリソースロード完了時のコールバック 何もしない
  protected onAdditionalResourceLoaded(): void {}

  //すべてのリソースロード処理完了時のコールバック
  public onResourceLoaded(): void {
    this.addChild(this.uiGraphContainer);
  }
}
