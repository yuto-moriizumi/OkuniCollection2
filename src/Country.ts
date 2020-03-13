export default class Country {
  public name: string;
  public img: string;
  public isOwn: boolean;
  public from: Set<number>;
  constructor(arg: any) {
    this.name = arg.name;
    this.img = arg.img;
    this.isOwn = arg.isOwn;
    this.from = arg.from;
  }
}
