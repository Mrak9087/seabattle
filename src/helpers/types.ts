export interface IShip {
  id: number;
  x: number;
  y: number;
  size: number;
  dir: string;
  placed: boolean;
  countHitDecks: number;
}

export interface IShipDrop {
  id: number;
  x: number;
  y: number;
}

export enum EShoot {
  MISS = 'miss',
  HIT = 'hit',
}

export interface IShoot {
  id: number;
  x: number;
  y: number;
  state: EShoot;
}

export interface ICell {
  x: number;
  y: number;
}
