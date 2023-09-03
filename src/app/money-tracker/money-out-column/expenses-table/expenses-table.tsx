import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "reactflow/dist/style.css";

const ExpensesTable = (props: { multiPayments: [string, number][] }) => {
  return (
    <div>
      {props.multiPayments.map((payment) => {
        return (
          <div key={payment[0]}>
            {/*use styles from tailwind*/}
            <div className="flex justify-between">
              <div>{payment[0]}</div>
              <div>{payment[1]}</div>
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default ExpensesTable;
