import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "reactflow/dist/style.css";
import CategoryTable from "app/money-tracker/money-out-column/expenses-table/category-table";
import { CategoryViewModel } from "app/money-tracker/money-out-column/category-view-model";

const ExpensesTable = (props: {
  setMultiPayments: (data: CategoryViewModel[]) => void;
  multiPayments: CategoryViewModel[];
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {props.multiPayments.map((payment, index) => {
          const title = payment.title;
          if (
            title === null ||
            title === undefined ||
            title === "" ||
            title === " "
          )
            return null;

          return (
            <div key={index}>
              <CategoryTable
                title={title}
                multiPayments={props.multiPayments}
                setMultiPayments={props.setMultiPayments}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ExpensesTable;
