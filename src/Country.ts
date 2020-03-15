export default class Country {
  public id: number;
  public name: string;
  public img: string;
  public isOwn: boolean;
  public from: Array<number>;
  constructor(id: number, arg: any) {
    this.id = id;
    this.name = arg.name;
    this.img = arg.img;
    this.isOwn = arg.isOwn;
    this.from = arg.from === undefined ? new Array<number>() : arg.from;
  }
}
