import './battleFieldTable.css';

interface IBatttleFieldTable { 
  handleClick?: (x:number, y:number) => void,
}

const BattleFieldTable = ({handleClick}:IBatttleFieldTable) => {

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
                return (
                  <td
                    key={idx}
                    style={{ width: '30px', height: '30px' } as React.CSSProperties}
                    onClick={() => tdClick(idx,rIdx)}
                  ></td>
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
