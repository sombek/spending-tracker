import ExpensesTable from "app/money-tracker/right-side/expenses-table/expenses-table";
import styles from "app/money-tracker/right-side/money-out-column.module.css";
import { RefObject } from "react";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";

const ExpensesArea = (props: {
  tableRefs: {
    [key: string]: RefObject<HotTable>;
  };
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
}) => {
  return (
    <div className={styles.moneyOutColumn}>
      <ExpensesTable
        tableRefs={props.tableRefs}
        multiPayments={props.multiPayments}
        setMultiPayments={props.setMultiPayments}
      />
    </div>
  );
};
export default ExpensesArea;
