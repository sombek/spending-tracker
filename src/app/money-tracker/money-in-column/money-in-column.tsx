import styles from "./money-in-column.module.css";
import { RefObject, useMemo } from "react";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";

const MoneyInColumn = (props: {
  tableRef: RefObject<HotTable>;
  moneyIn: Transaction[];
  setMoneyIn: (data: Transaction[]) => void;
}) => {
  const totalMoneyIn = useMemo(() => {
    if (props.moneyIn === undefined) return 0;
    return props.moneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [props.moneyIn]);

  return (
    <div>
      <div className={styles.moneyInColumnContent}>
        <div className={styles.moneyInTable}>
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            💰Money In
          </span>
          <div className="mt-2">
            <DataTable
              tableRef={props.tableRef}
              isMultiPayments={false}
              data={props.moneyIn}
              // data is being updated by the hot table
              // just need to create a copy of the data and update the state
              onAfterChange={(changes) => {
                if (changes === null) return;
                props.setMoneyIn([...props.moneyIn]);
              }}
              onAfterRemoveRow={() => props.setMoneyIn([...props.moneyIn])}
            />
          </div>
        </div>

        {/*  At bottom show sum*/}
        <div className={styles.sum}>
          <div className={styles.sumText}>Total</div>
          <div className={styles.sumAmount}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "SAR",
            }).format(totalMoneyIn)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoneyInColumn;
