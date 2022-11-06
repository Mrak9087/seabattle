import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SHIP_KILL, SHOOT_HIT, SHOOT_LIST, SHOOT_MISS, SHOOT_OUTSIDE_FIELD } from '../helpers/constants';
import {
  addShoot,
  canShoot,
  getFreeCell,
  isEmpty,
  isValid,
  randomizeShips,
} from '../helpers/helpers';
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

  isPlaying: true,
  isPlayerWin: false,
};

export const gameStore = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    start(state, action: PayloadAction<IShip[]>) {
      Object.assign(state, {
        ...initialState,
        shipsPlayer: action.payload,
        shipsBot: randomizeShips(),
        hitShip: null,
        lastShoot: null,

        shoots: SHOOT_LIST.slice(0),
        selectShoot: null,

        isPlaying: true,
        isPlayerWin: false,
      });
      state.shipsPlayer = action.payload;
      state.shipsBot = randomizeShips();
    },

    restart(state) {
      Object.assign(state, {
        ...initialState,
        shipsPlayer: randomizeShips(),
        shipsBot: randomizeShips(),
        hitShip: null,
        lastShoot: null,

        shoots: SHOOT_LIST.slice(0),
        selectShoot: null,

        isPlaying: true,
        isPlayerWin: false,
      });
    },

    resign(state) {
      state.isPlaying = false;
    },

    shoot(state, action: PayloadAction<IShoot>) {
      if (!state.isPlaying || state.isPlayerWin) {
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
        if (state.shipsBot.every((ship) => ship.size === ship.countHitDecks)) {
          state.isPlayerWin = true;
          state.isPlaying = false;
        }
        return;
      }

      let isBot = true;

      botLoop: while (isBot) {
        isBot = false;

        let botShoot: IShoot | null = null;

        if (!state.hitShip || isEmpty(state.hitShip)) {
          let freeCell = getFreeCell(state.shipsPlayer, state.shootsPlayer);

          if (!freeCell) {
            state.isPlaying = false;
            state.isPlayerWin = false;
            console.log('bot win');
            break;
          }

          botShoot = {
            id: 1 + Math.max(0, ...state.shootsPlayer.map((shot) => shot.id)),
            x: freeCell.x,
            y: freeCell.y,
            state: EShoot.MISS,
          };

          state.hitShip = addShoot(state.shipsPlayer, state.shootsPlayer, botShoot);

          if (state.hitShip) {
            state.lastShoot = botShoot;
          }
        } else {
          if (state.lastShoot && !isEmpty(state.lastShoot)) {
            if (!state.selectShoot || isEmpty(state.selectShoot)) {
              if (state.shoots.length) {
                const idx = Math.floor(Math.random() * state.shoots.length);
                state.selectShoot = state.shoots.splice(idx, 1)[0];
              } else {
                state.shoots = SHOOT_LIST.slice(0);
                state.selectShoot = null;
                console.log('shoot end 131');
                continue botLoop;
              }
            }
            let locX = state.lastShoot.x + state.selectShoot.x;
            let locY = state.lastShoot.y + state.selectShoot.y;

            let tmpShoot = canShoot(locX, locY, state.shipsPlayer, state.shootsPlayer);
            while (tmpShoot !== 0) {
              if (tmpShoot === SHOOT_HIT) {
                locX += state.selectShoot.x;
                locY += state.selectShoot.y;
              }
              if (tmpShoot === SHIP_KILL || tmpShoot === SHOOT_MISS) {
                locX -= state.selectShoot.x;
                locY -= state.selectShoot.y;
                const idx = Math.floor(Math.random() * state.shoots.length);
                state.selectShoot = state.shoots.splice(idx, 1)[0];
                locX += state.selectShoot.x;
                locY += state.selectShoot.y;
              }

              if (canShoot(locX, locY, state.shipsPlayer, state.shootsPlayer) === SHOOT_OUTSIDE_FIELD) {
                if (!state.selectShoot || isEmpty(state.selectShoot)) {
                  state.shoots = SHOOT_LIST.slice(0);
                  state.selectShoot = null;
                  console.log('shoot end 157');
                  continue botLoop;
                }
                try {
                  state.selectShoot.x *= -1;
                  state.selectShoot.y *= -1;
                } catch {
                  console.log(state.selectShoot);
                }
                locX = state.lastShoot.x + state.selectShoot.x;
                locY = state.lastShoot.y + state.selectShoot.y;
              }

              tmpShoot = canShoot(locX, locY, state.shipsPlayer, state.shootsPlayer);
            }

            if (!isValid(locX) || !isValid(locY)) {
              state.selectShoot = null;
              continue;
            }

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
          state.hitShip = null;
          state.lastShoot = null;
          state.selectShoot = null;
          state.shoots = SHOOT_LIST.slice(0);
        }

        if (state.shipsPlayer.every((ship) => ship.size === ship.countHitDecks)) {
          state.isPlayerWin = false;
          state.isPlaying = false;
          isBot = false;
        }
      }
    },
  },
});

export const { start, shoot, restart, resign } = gameStore.actions;

export default gameStore.reducer;
