import ExpensesTable from "app/money-tracker/money-out-column/expenses-table/expenses-table";
import styles from "app/money-tracker/money-out-column/money-out-column.module.css";
import OneTimePayments from "app/money-tracker/money-out-column/one-time-payments/one-time-payments";
import { useMemo } from "react";
import MultiPayments from "app/money-tracker/money-out-column/multi-payments/multi-payments";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";

const MoneyOutColumn = (props: {
  moneyIn: Transaction[];
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
}) => {
  const sumOfMoneyIn = useMemo(() => {
    if (props.moneyIn === undefined) return 0;
    return props.moneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [props.moneyIn]);

  const sumOfMoneyOut = useMemo(() => {
    if (props.multiPayments === undefined) return 0;
    const multiPaymentsSum = props.multiPayments.reduce((sum, payment) => {
      if (payment.purchases === undefined) {
        console.log(payment, "payment");
        return sum;
      }
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
        <div className={styles.moneyIn}>
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            💸 Money Out
          </span>
        </div>
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
        <div className={styles.sumText}>
          <div
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 `}
          >
            Money Out
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
              }).format(sumOfMoneyOut)}
            </span>
          </div>
        </div>

        <div className={styles.sumText}>
          <div
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 `}
          >
            Money Remaining
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 ${
                sumOfMoneyRemaining >= 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              } `}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
              }).format(sumOfMoneyRemaining)}
              {sumOfMoneyRemaining >= 0 ? (
                <span className="ml-1">💰</span>
              ) : (
                <span className="ml-1">💸</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoneyOutColumn;
