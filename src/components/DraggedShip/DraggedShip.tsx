import { FC, useEffect, useMemo, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { CELL_SIZE } from '../../helpers/constants';
import { IShip } from '../../helpers/types';

import './draggedShip.css';

interface IDraggedShip {
  ship: IShip;
  rotate: (id: number) => void;
}

const DraggedShip: FC<IDraggedShip> = ({ ship, rotate }) => {
  const refDrag = useRef(null);

  const shipWidth = useMemo(() => {
    const dirX = ship.dir === 'row' ? 1 : 0;
    return dirX * (ship.size - 1) * CELL_SIZE + CELL_SIZE;
  }, [ship.dir]);

  const shipHeight = useMemo(() => {
    const dirY = ship.dir === 'col' ? 1 : 0;
    return dirY * (ship.size - 1) * CELL_SIZE + CELL_SIZE;
  }, [ship.dir]);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'ship',
    item: ship,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(refDrag);

  const handleClick = () => {
    rotate(ship.id);
  };

  if (isDragging) {
    return <></>
  }

  return (
    <div
      ref={refDrag}
      className="ship"
      style={
        {
          width: `${shipWidth}px`,
          height: `${shipHeight}px`,
          top: `${ship.y * CELL_SIZE}px`,
          left: `${ship.x * CELL_SIZE}px`,
        } as React.CSSProperties
      }
      onClick={handleClick}
    ></div>
  );
};

export default DraggedShip;
