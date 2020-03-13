import Scene from "./Scene";
import LoaderAddParam from "./LoaderAddParam";
export default class TitleScene extends Scene {
    private text;
    private sound;
    private readonly textAppealDuration;
    constructor();
    protected createInitialResourceList(): (LoaderAddParam | string)[];
    protected onResourceLoaded(): void;
    showOrderScene(): void;
    update(dt: number): void;
}
