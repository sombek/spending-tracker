import ExpensesTable from "app/money-tracker/money-out-column/expenses-table/expenses-table";
import styles from "app/money-tracker/money-out-column/money-out-column.module.css";
import OneTimePayments from "app/money-tracker/money-out-column/one-time-payments/one-time-payments";
import { ComponentProps, forwardRef } from "react";
import MultiPayments from "app/money-tracker/money-out-column/multi-payments/multi-payments";

const MoneyOutColumn = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<"div">, "className">
>((props, ref) => (
  <div ref={ref} {...props} className={styles.moneyOutColumn}>
    <div className={styles.moneyOutHeader}>
      <div className={styles.moneyIn}>Money Out</div>
    </div>

    <div className={styles.moneyOutContent}>
      <div className={styles.moneyOutOneTimePayment}>
        <OneTimePayments />
        <br />
        <MultiPayments />
      </div>

      <div className={styles.moneyOutContentCanvas}>
        <ExpensesTable />
      </div>
    </div>
    <div className={styles.sum}>
      <div>Money Out</div>
      <div>£ 1,000.00</div>

      <div>Money Remaining</div>
      <div>£ 1,000.00</div>
    </div>
  </div>
));
export default MoneyOutColumn;
