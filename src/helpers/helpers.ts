import { IShip } from './types';

export const isValid = (coord: number): boolean => {
  return coord >= 0 && coord < 10;
};

export const isShipToField = (newShip: IShip, ships: IShip[]):boolean => {
  const matrix: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const row = new Array(10).fill(0);
    matrix.push(row);
  }

  ships.forEach((ship) => {
    const dx = ship.dir === 'row' ? 1 : 0;
    const dy = ship.dir === 'col' ? 1 : 0;
    for (let y = ship.y - 1; y <= ship.y + ship.size * dy + dx; y++) {
      for (let x = ship.x - 1; x <= ship.x + ship.size * dx + dy; x++) {
        matrix[y][x] = 1;
      }
    }
  });

  const dx = newShip.dir === 'row' ? 1 : 0;
  const dy = newShip.dir === 'col' ? 1 : 0;
  for (let y = newShip.y - 1; y <= newShip.y + newShip.size * dy + dx; y++) {
    if (!isValid(y)) return false;
    for (let x = newShip.x - 1; x <= newShip.x + newShip.size * dx + dy; x++) {
      if (!isValid(x) && matrix[y][x]) return false;
    }
  }
  return true;
};
