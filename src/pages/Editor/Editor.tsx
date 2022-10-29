import { useMemo, useRef } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import BattleField from '../../components/BattleField';
import Dock from '../../components/Dock';
import DraggedShip from '../../components/DraggedShip';
import Shoot from '../../components/Shoot';
import { CELL_SIZE } from '../../helpers/constants';
import { randomizeShips } from '../../helpers/helpers';
import { EShoot, IShip, IShipDrop, IShoot } from '../../helpers/types';
import { shoot } from '../../store/gameStore';
import { placed, randomPosition, rotate } from '../../store/shipStore';
import { RootStore } from '../../store/store';

const Editor = () => {
  const refField = useRef<HTMLElement | null>(null);
  const store = useSelector((state: RootStore) => state.shipStore);
  const game = useSelector((state: RootStore) => state.gameStore);
  const dispatch = useDispatch();

  const dockedShip = useMemo(()=>{
    return store.ships.filter((ship) => !ship.placed)
  },[store])

  const placedShip = useMemo(()=>{
    return store.ships.filter((ship) => ship.placed)
  },[store])

  const [, dropField] = useDrop({
    accept: 'ship',
    drop(item:IShip, monitor) {
      const mouseStart = monitor.getInitialClientOffset() as XYCoord;
      const mouseFinish = monitor.getClientOffset() as XYCoord;
      const shipStart = monitor.getInitialSourceClientOffset() as XYCoord;
      if (refField.current) {
        const rect = refField.current.getBoundingClientRect();

        const x = Math.floor(
          (mouseFinish.x - rect.left - mouseStart.x + shipStart.x + CELL_SIZE / 2) / CELL_SIZE
        );

        const y = Math.floor(
          (mouseFinish.y - rect.top - mouseStart.y + shipStart.y + CELL_SIZE / 2) / CELL_SIZE
        );

        const shipDrop:IShipDrop = {
          id:item.id,
          x,
          y
        };

        dispatch(placed(shipDrop))
      }
    },
  });

  dropField(refField);

  const shipRotate = (id:number) => {
    dispatch(rotate(id))
  }

  const handleRandom = () => {
    dispatch(randomPosition())
  }

  const clickCell = (x:number, y:number) => {
    const id = (game.shootsPlayer.length + 1)  * 10;
    const newShoot: IShoot = {
      id,
      x,
      y,
      state:EShoot.MISS
    }
    dispatch(shoot(newShoot))
  }

  return (
    <div className="editor">
      <BattleField itemRef={refField}>
        {placedShip.map((ship) => {
            return <DraggedShip key={ship.id} ship={ship} rotate={shipRotate}/>;
          })}
      </BattleField>
      <Dock>
        {dockedShip.map((ship) => {
            return <DraggedShip key={ship.id} ship={ship} rotate={shipRotate}/>;
          })}
      </Dock>
      <button onClick={handleRandom}>Random</button>
    </div>
  );
};

export default Editor;
