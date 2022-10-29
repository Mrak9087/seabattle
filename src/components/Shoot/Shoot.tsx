import { useMemo } from 'react';
import { CELL_SIZE } from '../../helpers/constants';
import { EShoot, IShoot } from '../../helpers/types';

import './shoot.css';

interface IShootView {
  shoot: IShoot;
}

const Shoot = ({ shoot }: IShootView) => {
  const shootChar = useMemo(() => {
    if (shoot.state === EShoot.HIT) {
      return <>&#10006;</>;
    }
    return <>&bull;</>;
  }, []);

  return (
    <div
      className={`shoot ${shoot.state === EShoot.HIT ? 'hit' : ''}`}
      style={
        {
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          top: `${shoot.y * CELL_SIZE}px`,
          left: `${shoot.x * CELL_SIZE}px`,
        } as React.CSSProperties
      }
    >
      {shootChar}
    </div>
  );
};

export default Shoot;
