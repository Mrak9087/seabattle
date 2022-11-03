import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BattleField from '../../components/BattleField';
import ShipView from '../../components/ShipView';
import Shoot from '../../components/Shoot';
import { EShoot, IShoot } from '../../helpers/types';
import { shoot, start } from '../../store/gameStore';
import { randomPosition } from '../../store/shipStore';
import { RootStore } from '../../store/store';

import './battle.css';

const Battle = () => {
  const store = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (store.shipStore.ships.filter((ship) => !ship.placed).length) {
      dispatch(randomPosition());
    }
  }, []);

  useEffect(() => {
    dispatch(start(store.shipStore.ships));
  }, [store.shipStore.ships]);

  const clickCell = (x: number, y: number) => {
    const id = (store.gameStore.shootsBot.length + 1) * 10;
    const newShoot: IShoot = {
      id,
      x,
      y,
      state: EShoot.MISS,
    };
    dispatch(shoot(newShoot));
  };

  return (
    <div className="battle">
      <BattleField>
        {store.gameStore.shipsPlayer.map((ship) => {
          return <ShipView key={ship.id} ship={ship} />;
        })}

        {store.gameStore.shootsPlayer.map((shoot) => {
          return <Shoot key={shoot.id} shoot={shoot} />;
        })}
      </BattleField>
      <BattleField handleClick={clickCell} isHover={true}>
        {store.gameStore.shipsBot
          .filter((ship) => ship.size === ship.countHitDecks)
          .map((shipV) => {
            return <ShipView key={shipV.id} ship={shipV} />;
          })}
        {!store.gameStore.isPlaying
          ? store.gameStore.shipsBot
              .filter((ship) => ship.size !== ship.countHitDecks)
              .map((shipV) => {
                return <ShipView key={shipV.id} ship={shipV} />;
              })
          : ''}
        {store.gameStore.shootsBot.map((shoot) => {
          return <Shoot key={shoot.id} shoot={shoot} />;
        })}
      </BattleField>
    </div>
  );
};

export default Battle;
