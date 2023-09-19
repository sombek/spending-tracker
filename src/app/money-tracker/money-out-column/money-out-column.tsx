import ExpensesTable from "app/money-tracker/money-out-column/expenses-table/expenses-table";
import styles from "app/money-tracker/money-out-column/money-out-column.module.css";
import { RefObject } from "react";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";

const MoneyOutColumn = (props: {
  tableRefs: {
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
    [key: string]: RefObject<HotTable>;
  };
  moneyIn: Transaction[];
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
}) => {
  return (
    <div className={styles.moneyOutColumn}>
      <div className={styles.moneyOutContentCanvas}>
        <ExpensesTable
          tableRefs={props.tableRefs}
          multiPayments={props.multiPayments}
          setMultiPayments={props.setMultiPayments}
        />
      </div>
    </div>
  );
};
export default MoneyOutColumn;
