import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shipList } from '../helpers/constants';
import { isShipToField } from '../helpers/helpers';
import { IShip } from '../helpers/types';

const initialStateBase = shipList.slice(0);

export const shipStore = createSlice({
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


export default shipStore.reducer;