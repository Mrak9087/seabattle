import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shipList } from '../helpers/constants';
import { isShipToField } from '../helpers/helpers';
import { IShip, IShipDrop } from '../helpers/types';

const initialStateBase = shipList.slice(0);

export const shipStore = createSlice({
  name: 'ship',
  initialState: initialStateBase,
  reducers: {
    placed(state, action: PayloadAction<IShipDrop>) {
      const shipIdx = state.findIndex((item) => item.id === action.payload.id);
      const newShip = state[shipIdx];
      newShip.x = action.payload.x;
      newShip.y = action.payload.y;
      const {x,y} = shipList[shipIdx];
      const placedShips = state.filter((ship)=> ship.placed)
      if (isShipToField(newShip, placedShips)) {
        if (shipIdx > -1) {
          state[shipIdx].x = action.payload.x;
          state[shipIdx].y = action.payload.y;
          state[shipIdx].placed = true;
        }
      } else {
        state[shipIdx].x = x;
        state[shipIdx].y = y;
        state[shipIdx].placed = false;
      }
    },
  },
});


export const {placed} = shipStore.actions

export default shipStore.reducer;