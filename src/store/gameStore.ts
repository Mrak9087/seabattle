import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addShoot, randomizeShips } from '../helpers/helpers';
import { IShip, IShoot } from '../helpers/types';

const initialState = {
  shipsPlayer: [] as IShip[],
  shootsPlayer: [] as IShoot[],

  shipsBot: [] as IShip[],
  shootsBot: [] as IShoot[],
};

export const gameStore = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    start(state, action: PayloadAction<IShip[]>) {
      state.shipsPlayer = action.payload;
      state.shipsBot = randomizeShips();
    },

    shoot(state, action: PayloadAction<IShoot>) {
      if (
        state.shootsBot.find((shoot) => shoot.x === action.payload.x && shoot.y === action.payload.y)
      ) {
        return;
      }
      
      addShoot(state.shipsBot, state.shootsBot, action.payload)
    },
  },
});

export const {start, shoot} = gameStore.actions;

export default gameStore.reducer;
