import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "reactflow/dist/style.css";
import CategoryTable from "app/money-tracker/money-out-column/expenses-table/category-table";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import { RefObject, useEffect, useMemo, useState } from "react";
import { HotTable } from "@handsontable/react";

const ExpensesTable = (props: {
  tableRefs: {
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
    [key: string]: RefObject<HotTable>;
  };
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  multiPayments: MultiPaymentBreakdown[];
}) => {
  // get page width
  const [width, setWidth] = useState(window.innerWidth);
  // if there is enough space, show 3 columns, otherwise show 2 columns, otherwise show 1 column
  const getColumns = useMemo(() => {
    if (width > 1260) return "grid-cols-3";
    else if (width > 1010) return "grid-cols-2";
    else return "grid-cols-1";
  }, [width]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div style={{ width: "100%" }}>
      <div className={`grid ${getColumns}`}>
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
            <div
              key={index}
              style={{
                maxWidth: 250,
                marginTop: index === 0 ? 0 : "0.5rem",
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <CategoryTable
                tableRef={props.tableRefs[title]}
                title={title}
                multiPayments={props.multiPayments}
                setMultiPayments={props.setMultiPayments}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpensesTable;
