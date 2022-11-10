import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SHIP_KILL,
  SHOOT_HIT,
  SHOOT_LIST,
  SHOOT_MISS,
  SHOOT_OUTSIDE_FIELD,
} from '../helpers/constants';
import {
  addShoot,
  canShoot,
  getFreeCell,
  isEmpty,
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
  directionShoot: {} as ICell | null,

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
        directionShoot: null,

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
        directionShoot: null,

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
            if (!state.directionShoot || isEmpty(state.directionShoot)) {
              if (state.shoots.length) {
                const idx = Math.floor(Math.random() * state.shoots.length);
                state.directionShoot = state.shoots.splice(idx, 1)[0];
              } else {
                state.shoots = SHOOT_LIST.slice(0);
                state.directionShoot = null;
                console.log('shoot end 131');
                continue botLoop;
              }
            }
            let locX = state.lastShoot.x + state.directionShoot.x;
            let locY = state.lastShoot.y + state.directionShoot.y;

            // console.log([state.lastShoot.x+1,state.lastShoot.y+1])
            // console.log([state.directionShoot.x,state.directionShoot.y])

            let tmpShoot = canShoot(locX, locY, state.shipsPlayer, state.shootsPlayer);
            while (tmpShoot !== 0) {
              try {
                if (tmpShoot === SHOOT_HIT) {
                  locX += state.directionShoot.x;
                  locY += state.directionShoot.y;
                }
                if (tmpShoot === SHIP_KILL || tmpShoot === SHOOT_MISS) {
                  isBot = true;
                  if (state.hitShip.countHitDecks > 1) {
                    // state.directionShoot.x = state.directionShoot.x * -1;
                    // state.directionShoot.y = state.directionShoot.y * -1;
                    state.directionShoot = {
                      ...state.directionShoot,
                      x: -1 * state.directionShoot.x,
                      y: -1 * state.directionShoot.y,
                    };
                  } else {
                    state.directionShoot = null;
                    if (!state.shoots.length) {
                      state.shoots = SHOOT_LIST.slice(0);
                    }
                  }
                  // console.log('continue');
                  continue botLoop;
                }

                if (tmpShoot === SHOOT_OUTSIDE_FIELD) {
                  // state.directionShoot.x *= -1;
                  // state.directionShoot.y *= -1;
                  state.directionShoot = {
                    ...state.directionShoot,
                    x: -1 * state.directionShoot.x,
                    y: -1 * state.directionShoot.y,
                  };
                  // state.directionShoot.x = state.directionShoot.x * -1;
                  // state.directionShoot.y = state.directionShoot.y * -1;

                  locX = state.lastShoot.x + state.directionShoot.x;
                  locY = state.lastShoot.y + state.directionShoot.y;
                }

                tmpShoot = canShoot(locX, locY, state.shipsPlayer, state.shootsPlayer);
              } catch (e) {
                isBot = true;
                console.log('shoot end 183');
                console.log(state.directionShoot);
                console.log(state.lastShoot);
                console.log(e);
                state.shoots = SHOOT_LIST.slice(0);
                state.directionShoot = null;
                continue botLoop;
              }
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
                if (state.directionShoot.x) {
                  state.shoots = state.shoots.filter((shoot) => shoot.x);
                } else {
                  state.shoots = state.shoots.filter((shoot) => shoot.y);
                }
              }
              state.directionShoot = null;
            }
          }
        }

        if (botShoot && botShoot.state === EShoot.HIT) {
          state.lastShoot = botShoot;
          isBot = true;
        }

        if (state.hitShip && state.hitShip.size === state.hitShip.countHitDecks) {
          isBot = true;
          state.hitShip = null;
          state.lastShoot = null;
          state.directionShoot = null;
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
