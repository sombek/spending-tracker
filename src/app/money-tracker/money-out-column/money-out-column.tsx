import ExpensesTable from "app/money-tracker/money-out-column/expenses-table/expenses-table";
import styles from "app/money-tracker/money-out-column/money-out-column.module.css";
import OneTimePayments from "app/money-tracker/money-out-column/one-time-payments/one-time-payments";
import { useMemo } from "react";
import MultiPayments from "app/money-tracker/money-out-column/multi-payments/multi-payments";
import {
  CategoryViewModel,
  PurchaseViewModel,
} from "app/money-tracker/money-out-column/category-view-model";

const MoneyOutColumn = (props: {
  moneyIn: PurchaseViewModel[];
  singlePayments: PurchaseViewModel[];
  setSinglePayments: (data: PurchaseViewModel[]) => void;
  multiPayments: CategoryViewModel[];
  setMultiPayments: (data: CategoryViewModel[]) => void;
}) => {
  const sumOfMoneyIn = useMemo(() => {
    return props.moneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [props.moneyIn]);

  const sumOfMoneyOut = useMemo(() => {
    const multiPaymentsSum = props.multiPayments.reduce((sum, payment) => {
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

    const singlePaymentsSum = props.singlePayments.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);

    return multiPaymentsSum + singlePaymentsSum;
  }, [props.multiPayments, props.singlePayments]);

  const sumOfMoneyRemaining = useMemo(() => {
    return sumOfMoneyIn - sumOfMoneyOut;
  }, [sumOfMoneyOut, sumOfMoneyIn]);

  return (
    <div className={styles.moneyOutColumn}>
      <div className={styles.moneyOutHeader}>
        <div className={styles.moneyIn}>💸 Money Out</div>
      </div>

      <div className={styles.moneyOutContent}>
        <div className={styles.moneyOutOneTimePayment}>
          <OneTimePayments
            singlePayments={props.singlePayments}
            setSinglePayments={props.setSinglePayments}
          />
          <br />
          <MultiPayments
            setMultiPayments={props.setMultiPayments}
            data={props.multiPayments}
          />
        </div>

        <div className={styles.moneyOutContentCanvas}>
          <ExpensesTable
            multiPayments={props.multiPayments}
            setMultiPayments={props.setMultiPayments}
          />
        </div>
      </div>
      <div className={styles.sum}>
        <div>Money Out</div>

        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "SAR",
          }).format(sumOfMoneyOut)}
        </div>

        <div>Money Remaining</div>
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "SAR",
          }).format(sumOfMoneyRemaining)}
        </div>
      </div>
    </div>
  );
};
export default MoneyOutColumn;
