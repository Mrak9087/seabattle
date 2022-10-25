import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shipList } from '../helpers/constants';
import { isShipToField, randomizeShips } from '../helpers/helpers';
import { IShip, IShipDrop } from '../helpers/types';

const initialStateBase = {
  ships:shipList.slice(0)
};

export const shipStore = createSlice({
  name: 'ship',
  initialState: initialStateBase,
  reducers: {
    placed(state, action: PayloadAction<IShipDrop>) {
      const shipIdx = state.ships.findIndex((item) => item.id === action.payload.id);
      const newShip = state.ships[shipIdx];
      newShip.x = action.payload.x;
      newShip.y = action.payload.y;
      newShip.placed = false;
      const {x,y,dir} = shipList[shipIdx];
      const placedShips = state.ships.filter((ship)=> ship.placed)
      if (isShipToField(newShip, placedShips)) {
        if (shipIdx > -1) {
          state.ships[shipIdx].x = action.payload.x;
          state.ships[shipIdx].y = action.payload.y;
          state.ships[shipIdx].placed = true;
        }
      } else {
        state.ships[shipIdx].x = x;
        state.ships[shipIdx].y = y;
        state.ships[shipIdx].dir = dir;
        state.ships[shipIdx].placed = false;
      }
    },
    rotate(state, action: PayloadAction<number>) {
      const shipIdx = state.ships.findIndex((item) => item.id === action.payload);
      const newShip = state.ships[shipIdx];
      newShip.dir = newShip.dir === 'row' ? 'col' : 'row';
      const {x,y,dir} = shipList[shipIdx];
      if (newShip.placed) {
        newShip.placed = false;
        const placedShips = state.ships.filter((ship)=> ship.placed)
        if (isShipToField(newShip, placedShips)) {
            state.ships[shipIdx].placed = true;
        } else {
          state.ships[shipIdx].x = x;
          state.ships[shipIdx].y = y;
          state.ships[shipIdx].dir = dir;
          state.ships[shipIdx].placed = false;
        }
      }
      
    },
    randomPosition(state) {
      state.ships = randomizeShips();
    }
  },
});


export const {placed, rotate, randomPosition} = shipStore.actions

export default shipStore.reducer;