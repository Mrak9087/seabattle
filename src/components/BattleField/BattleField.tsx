import {FC, LegacyRef, MutableRefObject, Ref} from "react";
import BattleFieldTable from '../BattleFieldTable';

interface IBattleField {
  itemRef?:MutableRefObject<HTMLElement | null>;
  children?: React.ReactNode;
}

const BattleField:FC<IBattleField> = ({itemRef,children}) => {
  return (
    <div className="battleField" ref={itemRef as LegacyRef<HTMLDivElement>}>
      <BattleFieldTable />
      {children}
    </div>
  );
};

export default BattleField;
