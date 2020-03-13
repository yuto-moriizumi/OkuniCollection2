import Scene from "./Scene";
import LoaderAddParam from "./LoaderAddParam";
export default class CombineScene extends Scene {
    private sound;
    private sidebar;
    private circle;
    private sidebarPadding;
    private flagHeight;
    private flagMarginTop;
    private flagFirstX;
    private flagFirstY;
    private circleChildren;
    constructor();
    protected createInitialResourceList(): (LoaderAddParam | string)[];
    protected onResourceLoaded(): void;
    update(dt: number): void;
    private onFlagClicked;
    private onFlagMove;
    private onFlagUp;
}
