import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "reactflow/dist/style.css";
import CategoryTable from "app/money-tracker/right-side/expenses-table/category-table";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import { RefObject, useEffect, useMemo, useState } from "react";
import { HotTable } from "@handsontable/react";

const ExpensesTable = (props: {
  tableRefs: {
    [key: string]: RefObject<HotTable>;
  };
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  multiPayments: MultiPaymentBreakdown[];
}) => {
  // get page width
  const [width, setWidth] = useState(window.innerWidth);
  // if there is enough space, show 3 columns, otherwise show 2 columns, otherwise show 1 column
  // formula left column = variable 300
  // 300 + 250 = 1 cols
  // 300 + 250 + 250 = 2 cols
  // 300 + 250 + 250 + 250 = 3 cols
  const leftColumnWidth = 300;
  const getColumns = useMemo(() => {
    if (width > leftColumnWidth + 250 * 6) return "grid-cols-6";
    else if (width > leftColumnWidth + 250 * 5) return "grid-cols-5";
    else if (width > leftColumnWidth + 250 * 4) return "grid-cols-4";
    else if (width > leftColumnWidth + 250 * 3) return "grid-cols-3";
    else if (width > leftColumnWidth + 250 * 2) return "grid-cols-2";
    else return "grid-cols-1";
  }, [width]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div className={`grid ${getColumns} gap gap-2`}>
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
              width: 250,
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
  );
};

export default ExpensesTable;
