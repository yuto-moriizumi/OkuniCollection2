import * as PIXI from "pixi.js";
import Flag from "./Flag";
import CombineScene from "./CombineScene";
export default class Circle extends PIXI.Sprite {
    private flags;
    private combineList;
    scene: CombineScene;
    constructor(scene: CombineScene, texture?: PIXI.Texture);
    addFlag(flag: Flag, combine?: boolean, position?: PIXI.Point): void;
    private combineCountry;
    removeFlag(flag: Flag): void;
}
