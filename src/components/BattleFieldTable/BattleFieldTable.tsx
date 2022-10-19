import './battleFieldTable.css';

const BattleFieldTable = () => {
  return (
    <table className="fieldTable">
      <tbody>
        {matrix.map((tr) => {
          return (
            <tr>
              {tr.map(() => {
                return <td style={{width:'30px', height:'30px'} as React.CSSProperties}></td>;
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
