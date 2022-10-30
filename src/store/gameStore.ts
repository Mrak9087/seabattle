import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SHOOT_LIST } from '../helpers/constants';
import { addShoot, getFreeCell, randomizeShips } from '../helpers/helpers';
import { EShoot, IShip, IShoot } from '../helpers/types';

const initialState = {
  shipsPlayer: [] as IShip[],
  shootsPlayer: [] as IShoot[],

  shipsBot: [] as IShip[],
  shootsBot: [] as IShoot[],

  hitShip: {} as IShip | null,

  shoots: SHOOT_LIST.slice(0),
  
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
      
      addShoot(state.shipsBot, state.shootsBot, action.payload);
      if (action.payload.state === EShoot.HIT) {
        return
      }

      console.log('missed')
      let isBot = true;

      while (isBot) {
        isBot = false;

        if (!state.hitShip) {
          let freeCell = getFreeCell(state.shipsPlayer, state.shootsPlayer);
  
          let botShoot: IShoot = {
            id: 1 + Math.max(0, ...state.shootsPlayer.map((shot) => shot.id)),
            x: freeCell.x, 
            y: freeCell.y,
            state: EShoot.MISS 
          }
          state.hitShip = addShoot(state.shipsPlayer, state.shootsPlayer, botShoot);
          if (botShoot.state === EShoot.HIT) {
            isBot=true;
          }
        } else {

        }

      }
    },
  },
});

export const {start, shoot} = gameStore.actions;

export default gameStore.reducer;
