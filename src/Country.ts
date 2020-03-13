export default class Country {
  public name: string;
  public img: string;
  public isOwn: boolean;
  public from: Array<number>;
  constructor(arg: any) {
    this.name = arg.name;
    this.img = arg.img;
    this.isOwn = arg.isOwn;
    this.from = new Array<number>(arg.from);
  }
}
