import { useSelector } from 'react-redux';
import { RootStore } from '../../store/store';
import BattleFieldTable from '../BattleFieldTable';
import Dock from '../Dock';
import DraggedShip from '../DraggedShip';

const BattleField = () => {
  const store = useSelector((state:RootStore)=> state.shipStore);

  return (
    <div className='battleField'>
      <BattleFieldTable />
      <Dock> 
        {store.filter((ship) => !ship.placed).map((ship, idx) => {
          return <DraggedShip key={idx} ship={ship}/>
        })}
      </Dock>
    </div>
  );
};

export default BattleField;
