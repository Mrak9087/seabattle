export const CELL_SIZE = 30;
export const SHOOT_OUTSIDE_FIELD = -1;
export const SHOOT_MISS = 1;
export const SHOOT_HIT = 3;
export const SHIP_KILL = 4;

export const shipList = [
  { id: 41, x: 1, y: 1, size: 4, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 31, x: 1, y: 3, size: 3, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 32, x: 5, y: 3, size: 3, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 21, x: 1, y: 5, size: 2, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 22, x: 4, y: 5, size: 2, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 23, x: 7, y: 5, size: 2, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 11, x: 1, y: 7, size: 1, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 12, x: 3, y: 7, size: 1, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 13, x: 5, y: 7, size: 1, dir: 'row', placed: false, countHitDecks: 0 },
  { id: 14, x: 7, y: 7, size: 1, dir: 'row', placed: false, countHitDecks: 0 },
];

export const SHOOT_LIST = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];
