import GameManager from "./GameManager";
import TitleScene from "./TitleScene";
import * as WebFont from "webfontloader";
import Resources from "./Resources";

let fontLoaded = false;
let windowLoaded = false;

WebFont.load({
  //カスタムフォントをダウンロードしておく
  custom: {
    families: [Resources.FontFamily.Default],
    urls: ["base.css"],
  },
  active: () => {
    fontLoaded = true;
    if (windowLoaded) initGame();
  },
});

window.onload = () => {
  windowLoaded = true;
  if (fontLoaded) initGame();
};

function initGame() {
  GameManager.start({
    glWidth: 1136,
    glHeight: 640,
    backgroundColor: 0x222222,
  }).then(() => GameManager.loadScene(new TitleScene()));
}
