import React, { FC } from 'react';
import { CELL_SIZE } from '../../helpers/constants';
import './dock.css';

interface IDock {
  children?: React.ReactNode;
}

const Dock: FC<IDock> = ({ children }) => {
  return (
    <div
      className="dock"
      style={{ width: `${CELL_SIZE * 10}px`, height: `${CELL_SIZE * 10}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default Dock;
