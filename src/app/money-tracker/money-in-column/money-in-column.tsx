import styles from "./money-in-column.module.css";
import { PurchaseViewModel } from "app/money-tracker/money-out-column/category-view-model";
import { useMemo } from "react";
import DataTable from "components/data-table";

const MoneyInColumn = (props: {
  moneyIn: PurchaseViewModel[];
  setMoneyIn: (data: PurchaseViewModel[]) => void;
}) => {
  const totalMoneyIn = useMemo(() => {
    return props.moneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [props.moneyIn]);

  return (
    <div>
      <div className={styles.moneyInColumnContent}>
        <div className={styles.moneyInHeader}>
          <div className={styles.moneyIn}>💰Money In</div>
        </div>
        <div
          className={"bg-white"}
          style={{
            padding: 10,
            height: "calc(100vh - (50px + 64px + 50px + 1px))",
            borderRight: "1px solid #e2e8f0",
          }}
        >
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
