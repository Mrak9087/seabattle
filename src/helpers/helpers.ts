import { IShip } from './types';

export const isValid = (coord: number): boolean => {
  return coord >= 0 && coord < 10;
};

export const isShipToField = (newShip: IShip, ships: IShip[]): boolean => {
  const matrix: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const row = new Array(10).fill(0);
    matrix.push(row);
  }

  ships.forEach((ship) => {
    const dx = ship.dir === 'row' ? 1 : 0;
    const dy = ship.dir === 'col' ? 1 : 0;
    for (let y = ship.y - 1; y <= ship.y + ship.size * dy + dx; y++) {
      if (!isValid(y)) {
        continue
      };
      for (let x = ship.x - 1; x <= ship.x + ship.size * dx + dy; x++) {
        if (!isValid(x)) {
          continue
        };
        matrix[y][x] = 1;
      }
    }
  });

  console.log(matrix);

  const dx = newShip.dir === 'row' ? 1 : 0;
  const dy = newShip.dir === 'col' ? 1 : 0;
  for (let i = 0; i < newShip.size; i++) {
    const x = newShip.x + i * dx;
    const y = newShip.y + i * dy;

    if (!isValid(x) || !isValid(y) || matrix[y][x]) {
      return false;
    }
  }
  return true;
};
