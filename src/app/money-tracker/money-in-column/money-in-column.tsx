import styles from "./money-in-column.module.css";
import { useMemo } from "react";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";

const MoneyInColumn = (props: {
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
        <div className={styles.moneyInHeader}>
          <div className={styles.moneyIn}>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              💰Money In
            </span>
          </div>
        </div>
        <div className={styles.moneyInTable}>
          <DataTable
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
