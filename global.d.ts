/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container, FederatedPointerEvent, DisplayObject } from "pixi.js";
import { Sprite as PixiSprite } from "@pixi/sprite";

export {};

// For some reason the types coming from @pixi scoped packages are not being merged,
// merge them here manually
declare module "@pixi/display" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DisplayObject extends GlobalMixins.DisplayObject {}

  interface Container extends GlobalMixins.DisplayObject {
    emit: EventEmitter.Emit<SpriteEvents>;
    on: EventEmitter.On<SpriteEvents, this>;
    once: EventEmitter.Once<SpriteEvents, this>;
    off: EventEmitter.Off<SpriteEvents>;
  }
}

// https://github.com/pixijs/pixijs/issues/7429
export type EventList = Record<string, any[]>;

export namespace EventEmitter {
  export type Emit<EventTypes extends EventList> = <
    K extends keyof EventTypes & string,
  >(
    event: K,
    ...args: EventTypes[K]
  ) => boolean;
  export type On<EventTypes extends EventList, This> = <
    K extends keyof EventTypes & string,
  >(
    event: K,
    fn: (...params: EventTypes[K]) => void,
    context?: any,
  ) => This;
  export type Once<EventTypes extends EventList, This> = <
    K extends keyof EventTypes & string,
  >(
    event: K,
    fn: (...params: EventTypes[K]) => void,
    context?: any,
  ) => This;
  export type Off<EventTypes extends EventList> = <
    K extends keyof EventTypes & string,
  >(
    event: K,
  ) => unknown;
}

declare module "@pixi/sprite" {
  interface Sprite extends PixiSprite {
    emit: EventEmitter.Emit<SpriteEvents>;
    on: EventEmitter.On<SpriteEvents, this>;
    once: EventEmitter.Once<SpriteEvents, this>;
    off: EventEmitter.Off<SpriteEvents>;
  }
}

export type SpriteEvents = {
  added: [container: Container];
  click: [event: FederatedPointerEvent];
  mousedown: [event: FederatedPointerEvent];
  mousemove: [event: FederatedPointerEvent];
  mouseout: [event: FederatedPointerEvent];
  mouseover: [event: FederatedPointerEvent];
  mouseup: [event: FederatedPointerEvent];
  mouseupoutside: [event: FederatedPointerEvent];
  pointercancel: [event: FederatedPointerEvent];
  pointerdown: [event: FederatedPointerEvent];
  pointermove: [event: FederatedPointerEvent];
  pointerout: [event: FederatedPointerEvent];
  pointerover: [event: FederatedPointerEvent];
  pointertap: [event: FederatedPointerEvent];
  pointerup: [event: FederatedPointerEvent];
  pointerupoutside: [event: FederatedPointerEvent];
  removed: [container: Container];
  removedFrom: [child: DisplayObject, container: Container, index: number];
  rightclick: [event: FederatedPointerEvent];
  rightdown: [event: FederatedPointerEvent];
  rightup: [event: FederatedPointerEvent];
  rightupoutside: [event: FederatedPointerEvent];
  tap: [event: FederatedPointerEvent];
  touchcancel: [event: FederatedPointerEvent];
  touchend: [event: FederatedPointerEvent];
  touchendoutside: [event: FederatedPointerEvent];
  touchmove: [event: FederatedPointerEvent];
  touchstart: [event: FederatedPointerEvent];
};
