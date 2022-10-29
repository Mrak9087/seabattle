import {FC, LegacyRef, MutableRefObject, Ref} from "react";
import BattleFieldTable from '../BattleFieldTable';

interface IBattleField {
  itemRef?:MutableRefObject<HTMLElement | null>;
  children?: React.ReactNode;
  handleClick?: (x:number, y:number) => void,
}

const BattleField:FC<IBattleField> = ({itemRef,children,handleClick}) => {
  return (
    <div className="battleField" ref={itemRef as LegacyRef<HTMLDivElement>}>
      <BattleFieldTable handleClick={handleClick} />
      {children}
    </div>
  );
};

export default BattleField;
