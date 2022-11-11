import { shipList, SHIP_KILL, SHOOT_HIT, SHOOT_MISS, SHOOT_OUTSIDE_FIELD } from './constants';
import { EShoot, ICell, IShip, IShoot } from './types';

function getEmptyMatrix() {
  const matrix: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const row = new Array(10).fill(0);
    matrix.push(row);
  }
  return matrix;
}

export const isValid = (coord: number): boolean => {
  return coord >= 0 && coord < 10;
};

export const isShipToField = (newShip: IShip, ships: IShip[]): boolean => {
  const matrix: number[][] = getEmptyMatrix();

  ships.forEach((ship) => {
    const dx = ship.dir === 'row' ? 1 : 0;
    const dy = ship.dir === 'col' ? 1 : 0;
    for (let y = ship.y - 1; y <= ship.y + ship.size * dy + dx; y++) {
      if (!isValid(y)) {
        continue;
      }
      for (let x = ship.x - 1; x <= ship.x + ship.size * dx + dy; x++) {
        if (!isValid(x)) {
          continue;
        }
        matrix[y][x] = 1;
      }
    }
  });

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

export const randomizeShips = () => {
  const locShips = shipList.slice(0);
  for (let i = 0; i < locShips.length; i++) {
    const newShip = { ...locShips[i] };
    while (!newShip.placed) {
      newShip.x = Math.floor(Math.random() * 10);
      newShip.y = Math.floor(Math.random() * 10);
      newShip.dir = ['row', 'col'][Math.floor(Math.random() * 2)];
      newShip.placed = true;
      const placedShips = locShips.filter((ship) => ship.placed);
      if (!isShipToField(newShip, placedShips)) {
        newShip.placed = false;
      } else {
        locShips[i] = { ...newShip };
      }
    }
  }
  return locShips;
};

export const addShoot = (ships: IShip[], shoots: IShoot[], shoot: IShoot) => {
  shoots.push(shoot);

  for (let ship of ships) {
    const dx = ship.dir === 'row' ? 1 : 0;
    const dy = ship.dir === 'col' ? 1 : 0;
    for (let i = 0; i < ship.size; i++) {
      const x = ship.x + i * dx;
      const y = ship.y + i * dy;

      if (shoot.x === x && shoot.y === y) {
        shoot.state = EShoot.HIT;
        ship.countHitDecks++;
        return ship;
      }
    }
  }
  return null;
};

export const getFreeCell = (ships: IShip[], shoots: IShoot[]) => {
  const matrix: number[][] = getEmptyMatrix();

  for (const { x, y } of shoots) {
    matrix[y][x] = 3;
  }

  ships.forEach((ship) => {
    const dx = ship.dir === 'row' ? 1 : 0;
    const dy = ship.dir === 'col' ? 1 : 0;

    if (ship.size === ship.countHitDecks) {
      for (let y = ship.y - 1; y <= ship.y + ship.size * dy + dx; y++) {
        if (!isValid(y)) {
          continue;
        }
        for (let x = ship.x - 1; x <= ship.x + ship.size * dx + dy; x++) {
          if (!isValid(x)) {
            continue;
          }
          matrix[y][x] = 1;
        }
      }
    }
  });

  const freeCells: ICell[] = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x] === 0) {
        freeCells.push({ x, y });
      }
    }
  }

  let idx = Math.floor(Math.random() * freeCells.length);
  let freeCell = freeCells[idx];

  const liveShips = ships.filter((ship) => !ship.countHitDecks);

  if (liveShips.length <= 3) {
    let isLoop = true;

    liveShips.sort((a,b) => b.size - a.size);

    console.log([...liveShips]);

    while (isLoop) {
      isLoop = false;
      let countLeftX = countCell(matrix, freeCell, liveShips[0].size, {x:-1, y:0});
      let countRightX = countCell(matrix, freeCell, liveShips[0].size, {x:1, y:0});
      let countTopY = countCell(matrix, freeCell, liveShips[0].size, {x:0, y:-1});
      let countBottomY = countCell(matrix, freeCell, liveShips[0].size, {x:0, y:1});
      if (countLeftX + countRightX >= liveShips[0].size || countTopY + countBottomY >= liveShips[0].size){
        return freeCell;
      } else {
        isLoop = true;
        
        freeCells.splice(idx, 1);
        idx = Math.floor(Math.random() * freeCells.length);
        freeCell = freeCells[idx];
      }
    }
  }

  return freeCell;
};

const countCell = (matrix:number[][], cell:ICell, size:number, direction:ICell ) => {
  let countEmptyCell = 1;
  for (let i = 1; i < size; i++) {
    let locX = cell.x + i * direction.x;
    let locY = cell.y + i * direction.y;
    if (!isValid(locX) || !isValid(locY)) break;
    if (matrix[locY][locX] === 0) {
      countEmptyCell ++;
    } else break;
  }
  return countEmptyCell
}

export const isEmpty = (obj: Object) => {
  for (let key in obj) {
    return false;
  }
  return true;
};

export const canShoot = (x: number, y: number, ships: IShip[], shoots: IShoot[]) => {
  if (!isValid(x) || !isValid(y)) {
    return SHOOT_OUTSIDE_FIELD;
  }

  const matrix: number[][] = getEmptyMatrix();

  const killShips = ships.filter((ship) => ship.size === ship.countHitDecks);

  killShips.forEach((ship) => {
    const dx = ship.dir === 'row' ? 1 : 0;
    const dy = ship.dir === 'col' ? 1 : 0;
    for (let y = ship.y - 1; y <= ship.y + ship.size * dy + dx; y++) {
      if (!isValid(y)) {
        continue;
      }
      for (let x = ship.x - 1; x <= ship.x + ship.size * dx + dy; x++) {
        if (!isValid(x)) {
          continue;
        }
        matrix[y][x] = SHIP_KILL;
      }
    }
  });

  for (const { x, y, state } of shoots) {
    if (state === EShoot.HIT) {
      matrix[y][x] = SHOOT_HIT;
    } else matrix[y][x] = SHOOT_MISS;
  }

  return matrix[y][x];
};
