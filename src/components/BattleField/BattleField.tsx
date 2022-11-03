import {FC, LegacyRef, MutableRefObject, Ref} from "react";
import BattleFieldTable from '../BattleFieldTable';

import './battleField.css';

interface IBattleField {
  itemRef?:MutableRefObject<HTMLElement | null>;
  children?: React.ReactNode;
  handleClick?: (x:number, y:number) => void,
  isHover?:boolean;
}

const BattleField:FC<IBattleField> = ({itemRef,children,handleClick,isHover}) => {
  return (
    <div className="battleField" ref={itemRef as LegacyRef<HTMLDivElement>}>
      <BattleFieldTable handleClick={handleClick} isHover={isHover}/>
      {children}
    </div>
  );
};

export default BattleField;
