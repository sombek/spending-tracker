import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "reactflow/dist/style.css";
import CategoryTable from "app/money-tracker/money-out-column/expenses-table/category-table";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import { useEffect, useMemo, useState } from "react";

const ExpensesTable = (props: {
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  multiPayments: MultiPaymentBreakdown[];
}) => {
  // get page width
  const [width, setWidth] = useState(window.innerWidth);
  // if there is enough space, show 3 columns, otherwise show 2 columns, otherwise show 1 column
  const getColumns = useMemo(() => {
    if (width > 1150) return 3;
    else if (width > 935) return 2;
    return 1;
  }, [width]);

  const [columns, setColumns] = useState(getColumns);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setColumns(getColumns);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getColumns, width]);

  return (
    <>
      <div className={`grid grid-cols-${columns} gap-4`}>
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
