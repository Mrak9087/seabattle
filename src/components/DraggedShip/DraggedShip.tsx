import { FC, useEffect, useMemo, useRef } from 'react';
import { CELL_SIZE } from '../../helpers/constants';
import { IShip } from '../../helpers/types';

import './draggedShip.css';

interface IDraggedShip {
  ship: IShip;
}

const DraggedShip: FC<IDraggedShip> = ({ ship }) => {
  const shipWidth = useMemo(() => {
    const dirX = ship.dir === 'row' ? 1 : 0;
    return dirX * (ship.size - 1) * CELL_SIZE + CELL_SIZE;
  }, [ship.dir]);

  const shipHeight = useMemo(() => {
    const dirY = ship.dir === 'col' ? 1 : 0;
    return dirY * (ship.size - 1) * CELL_SIZE + CELL_SIZE;
  }, [ship.dir]);

  return (
    <div
      className="ship"
      style={
        {
          width: `${shipWidth}px`,
          height: `${shipHeight}px`,
          top: `${ship.y * CELL_SIZE}px`,
          left: `${ship.x * CELL_SIZE}px`,
        } as React.CSSProperties
      }
    ></div>
  );
};

export default DraggedShip;
