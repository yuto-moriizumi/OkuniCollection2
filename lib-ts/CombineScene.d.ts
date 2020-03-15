import * as PIXI from "pixi.js";
import Scene from "./Scene";
import LoaderAddParam from "./LoaderAddParam";
import Circle from "./Circle";
export default class CombineScene extends Scene {
    private sound;
    sidebar: PIXI.Graphics;
    circle: Circle;
    private sidebarFlags;
    private progressText;
    private get flagMargin();
    constructor();
    protected createInitialResourceList(): (LoaderAddParam | string)[];
    protected onResourceLoaded(): void;
    createSidebar(): void;
    onKingdomOfYugoslavia(): void;
    update(dt: number): void;
}
