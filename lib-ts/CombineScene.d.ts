import Scene from "./Scene";
import LoaderAddParam from "./LoaderAddParam";
export default class CombineScene extends Scene {
    private sound;
    private sidebar;
    private sidebarPadding;
    private flagHeight;
    private flagMarginTop;
    constructor();
    protected createInitialResourceList(): (LoaderAddParam | string)[];
    protected onResourceLoaded(): void;
    update(dt: number): void;
    private onFlagClicked;
}
