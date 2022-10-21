import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isShipToField } from '../helpers/helpers';
import { IShip } from '../helpers/types';

const initialStateBase = [
  { id: 41, x: 0, y: 0, size: 4, dir: 'row', placed: false },
  { id: 31, x: 0, y: 0, size: 3, dir: 'row', placed: false },
  { id: 32, x: 0, y: 0, size: 3, dir: 'row', placed: false },
  { id: 21, x: 0, y: 0, size: 2, dir: 'row', placed: false },
  { id: 22, x: 0, y: 0, size: 2, dir: 'row', placed: false },
  { id: 23, x: 0, y: 0, size: 2, dir: 'row', placed: false },
  { id: 11, x: 0, y: 0, size: 1, dir: 'row', placed: false },
  { id: 12, x: 0, y: 0, size: 1, dir: 'row', placed: false },
  { id: 13, x: 0, y: 0, size: 1, dir: 'row', placed: false },
  { id: 14, x: 0, y: 0, size: 1, dir: 'row', placed: false },
];

const ship = createSlice({
  name: 'ship',
  initialState: initialStateBase,
  reducers: {
    placed(state, action: PayloadAction<IShip>) {
      if (isShipToField(action.payload, state)) {
        const shipIdx = state.findIndex((item) => item.id === action.payload.id);
        if (shipIdx > -1) {
          state[shipIdx].x = action.payload.x;
          state[shipIdx].y = action.payload.y;
          state[shipIdx].placed = true;
        }
      }
    },
  },
});
