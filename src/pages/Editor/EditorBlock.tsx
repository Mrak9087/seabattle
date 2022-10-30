import { useMemo, useRef } from 'react';
import { DndProvider, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import BattleField from '../../components/BattleField';
import Dock from '../../components/Dock';
import DraggedShip from '../../components/DraggedShip';
import { CELL_SIZE } from '../../helpers/constants';
import { IShip, IShipDrop } from '../../helpers/types';
import { placed, randomPosition, rotate } from '../../store/shipStore';
import { RootStore } from '../../store/store';

const EditorBlock = () => {
  const refField = useRef<HTMLElement | null>(null);
  const store = useSelector((state: RootStore) => state.shipStore);
  const dispatch = useDispatch();

  const dockedShip = useMemo(() => {
    return store.ships.filter((ship) => !ship.placed);
  }, [store]);

  const placedShip = useMemo(() => {
    return store.ships.filter((ship) => ship.placed);
  }, [store]);

  const [, dropField] = useDrop({
    accept: 'ship',
    drop(item: IShip, monitor) {
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

        const shipDrop: IShipDrop = {
          id: item.id,
          x,
          y,
        };

        dispatch(placed(shipDrop));
      }
    },
  });

  dropField(refField);

  const shipRotate = (id: number) => {
    dispatch(rotate(id));
  };

  const handleRandom = () => {
    dispatch(randomPosition());
  };

  return (
      <div className="editorBlock">
        <BattleField itemRef={refField}>
          {placedShip.map((ship) => {
            return <DraggedShip key={ship.id} ship={ship} rotate={shipRotate} />;
          })}
        </BattleField>
        <Dock>
          {dockedShip.map((ship) => {
            return <DraggedShip key={ship.id} ship={ship} rotate={shipRotate} />;
          })}
        </Dock>
        <button onClick={handleRandom}>Random</button>
      </div>
  );
};

export default EditorBlock;
