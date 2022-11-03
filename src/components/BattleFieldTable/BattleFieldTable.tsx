import { CELL_SIZE } from '../../helpers/constants';
import './battleFieldTable.css';

interface IBatttleFieldTable { 
  handleClick?: (x:number, y:number) => void,
  isHover?:boolean;
}

const BattleFieldTable = ({handleClick, isHover}:IBatttleFieldTable) => {

  const tdClick = (x:number, y:number) => {
    if (handleClick) handleClick(x,y)
  }

  return (
    <table className="fieldTable">
      <tbody>
        {matrix.map((tr,rIdx) => {
          return (
            <tr key={rIdx}>
              {tr.map((i, idx) => {
                let markerX = null;
                let markerY = null;
  
                if (idx === 0) {
                  markerX = (
                    <span
                      className='marker'
                      style={{ left: `-${CELL_SIZE}px`, top:`${CELL_SIZE * rIdx}px`, width: '30px', height: '30px' }}
                    >
                      {rIdx + 1}
                    </span>
                  );
                }
  
                if (rIdx === 0) {
                  markerY = (
                    <span
                      className='marker'
                      style={{ top: `-${CELL_SIZE}px`, width: '30px', height: '30px' }}
                    >
                      {"АБВГДЕЖЗИК"[idx]}
                    </span>
                  );
                }
                return (
                  <td
                    className={isHover ? 'hovered' : ''}
                    key={idx}
                    style={{ width: '30px', height: '30px' } as React.CSSProperties}
                    onClick={() => tdClick(idx,rIdx)}
                  >
                    {markerX}
                    {markerY}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BattleFieldTable;

const matrix: Number[][] = [];
const COUNT_TR = 10;
const COUNT_TD = 10;

for (let i = 0; i < COUNT_TR; i++) {
  matrix.push(new Array(COUNT_TD).fill(0));
}
