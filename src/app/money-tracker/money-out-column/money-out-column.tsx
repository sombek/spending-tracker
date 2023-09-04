import ExpensesTable from "app/money-tracker/money-out-column/expenses-table/expenses-table";
import styles from "app/money-tracker/money-out-column/money-out-column.module.css";
import OneTimePayments from "app/money-tracker/money-out-column/one-time-payments/one-time-payments";
import { useMemo, useState } from "react";
import MultiPayments from "app/money-tracker/money-out-column/multi-payments/multi-payments";
import { CategoryViewModel } from "app/money-tracker/money-out-column/category-view-model";

const MoneyOutColumn = () => {
  // multi-payments state
  const [multiPayments, setMultiPayments] = useState<CategoryViewModel[]>([
    {
      title: "Rent",
      purchases: [],
    },
    {
      title: "Food",
      purchases: [],
    },
  ]);

  const sumOfMoneyOut = useMemo(() => {
    return multiPayments.reduce((sum, payment) => {
      if (payment.purchases.length == 0) return 0;

      return (
        sum +
        payment.purchases.reduce((sum, purchase) => {
          if (purchase.amount === null || purchase.amount === undefined)
            return sum;

          return sum + +purchase.amount;
        }, 0)
      );
    }, 0);
  }, [multiPayments]);

  const sumOfMoneyRemaining = useMemo(() => {
    return 1000 - sumOfMoneyOut;
  }, [sumOfMoneyOut]);

  return (
    <div className={styles.moneyOutColumn}>
      <div className={styles.moneyOutHeader}>
        <div className={styles.moneyIn}>💸 Money Out</div>
      </div>

      <div className={styles.moneyOutContent}>
        <div className={styles.moneyOutOneTimePayment}>
          <OneTimePayments />
          <br />
          <MultiPayments
            setMultiPayments={setMultiPayments}
            data={multiPayments}
          />
        </div>

        <div className={styles.moneyOutContentCanvas}>
          <ExpensesTable
            multiPayments={multiPayments}
            setMultiPayments={setMultiPayments}
          />
        </div>
      </div>
      <div className={styles.sum}>
        <div>Money Out</div>

        <div>{sumOfMoneyOut}</div>

        <div>Money Remaining</div>
        <div>{sumOfMoneyRemaining}</div>
      </div>
    </div>
  );
};
export default MoneyOutColumn;
