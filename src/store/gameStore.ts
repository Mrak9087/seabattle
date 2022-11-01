import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SHOOT_LIST } from '../helpers/constants';
import { addShoot, getFreeCell, isEmpty, isValid, randomizeShips } from '../helpers/helpers';
import { EShoot, IShip, IShoot, ICell } from '../helpers/types';

const initialState = {
  shipsPlayer: [] as IShip[],
  shootsPlayer: [] as IShoot[],

  shipsBot: [] as IShip[],
  shootsBot: [] as IShoot[],

  hitShip: {} as IShip | null,
  lastShoot: {} as IShoot | null,

  shoots: SHOOT_LIST.slice(0),
  selectShoot: {} as ICell | null,

  isPlaying:true,
  isPlayerWin:false,
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
      if (!state.isPlaying || state.isPlayerWin){
        return;
      }
      if (
        state.shootsBot.find(
          (shoot) => shoot.x === action.payload.x && shoot.y === action.payload.y
        )
      ) {
        return;
      }

      addShoot(state.shipsBot, state.shootsBot, action.payload);
      if (action.payload.state === EShoot.HIT) {
        return;
      }

      let isBot = true;

      while (isBot) {
        isBot = false;

        let botShoot: IShoot | null = null;

        if (!state.hitShip || isEmpty(state.hitShip)) {
          let freeCell = getFreeCell(state.shipsPlayer, state.shootsPlayer);

          botShoot = {
            id: 1 + Math.max(0, ...state.shootsPlayer.map((shot) => shot.id)),
            x: freeCell.x,
            y: freeCell.y,
            state: EShoot.MISS,
          };

          state.hitShip = addShoot(state.shipsPlayer, state.shootsPlayer, botShoot);

          if (state.hitShip) state.lastShoot = botShoot;
        } else {
          if (state.lastShoot && !isEmpty(state.lastShoot)) {
            if (!state.selectShoot || isEmpty(state.selectShoot)) {
              if (state.shoots.length) {
                const idx = Math.floor(Math.random() * state.shoots.length);
                state.selectShoot = state.shoots.splice(idx, 1)[0];
              } else break;
            }
            console.log([state.lastShoot, state.selectShoot]);

            let locX = state.lastShoot.x + state.selectShoot.x;
            let locY = state.lastShoot.y + state.selectShoot.y;

            if (!isValid(locX) || !isValid(locY)) {
              state.selectShoot.x *= -1;
              state.selectShoot.y *= -1;
              locX = state.lastShoot.x + state.selectShoot.x;
              locY = state.lastShoot.y + state.selectShoot.y;
            }

            console.log('before',[locX,locY]);
            while (state.shootsPlayer.find((shoot) => shoot.x === locX && shoot.y === locY)) {
              console.log([locX,locY,state.selectShoot.x,state.selectShoot.y]);
              locX += state.selectShoot.x;
              locY += state.selectShoot.y;
            }

            

            console.log(state.hitShip);

            botShoot = {
              id: 1 + Math.max(0, ...state.shootsPlayer.map((shot) => shot.id)),
              x: locX,
              y: locY,
              state: EShoot.MISS,
            };

            const locHitShip = addShoot(state.shipsPlayer, state.shootsPlayer, botShoot);

            if (locHitShip) {
              state.hitShip = locHitShip;
            }

            if (botShoot && botShoot.state === EShoot.MISS) {
              if (state.hitShip && state.hitShip.countHitDecks > 1) {
                if (state.selectShoot.x) {
                  state.shoots = state.shoots.filter((shoot) => shoot.x);
                } else {
                  state.shoots = state.shoots.filter((shoot) => shoot.y);
                }
              }
              state.selectShoot = null;
            }
          }
        }

        if (botShoot && botShoot.state === EShoot.HIT) {
          state.lastShoot = botShoot;
          isBot = true;
        }

        if (state.hitShip && state.hitShip.size === state.hitShip.countHitDecks) {
          console.log('ship done');
          state.hitShip = null;
          state.lastShoot = null;
          state.selectShoot = null;
          state.shoots = SHOOT_LIST.slice(0);
        }
      }

      if (state.shipsBot.every((ship)=> ship.size === ship.countHitDecks)){
        state.isPlayerWin = true;
        state.isPlaying = false;
        console.log('player win');
      }
      if (state.shipsPlayer.every((ship)=> ship.size === ship.countHitDecks)){
        state.isPlayerWin = false;
        state.isPlaying = false;
        console.log('bot win');
      }
    },
  },
});

export const { start, shoot } = gameStore.actions;

export default gameStore.reducer;
