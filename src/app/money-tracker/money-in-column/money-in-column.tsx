import styles from "./money-in-column.module.css";
import { RefObject, useMemo } from "react";
import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";
import OneTimePayments from "app/money-tracker/money-out-column/one-time-payments/one-time-payments";
import MultiPayments from "app/money-tracker/money-out-column/multi-payments/multi-payments";
import ResultsTable from "app/money-tracker/money-in-column/results-table";

const MoneyInColumn = (props: {
  tableRefs: {
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
    [key: string]: RefObject<HotTable>;
  };
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
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
    <div className={styles.moneyInTable}>
      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-900 ring-1 ring-inset ring-indigo-700/10">
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

      <div className="mt-2">
        <OneTimePayments
          tableRef={props.tableRefs.singlePayments}
          singlePayments={props.singlePayments}
          setSinglePayments={props.setSinglePayments}
        />
      </div>
      <div className="mt-2">
        <MultiPayments
          tableRef={props.tableRefs.multiPayments}
          setMultiPayments={props.setMultiPayments}
          data={props.multiPayments}
        />
      </div>

      <div className="mt-2">
        <ResultsTable
          totalMoneyOut={sumOfMoneyOut}
          totalMoneyIn={totalMoneyIn}
          totalMoneyLeft={sumOfMoneyRemaining}
          daysUntilNextPaycheck={12}
        />
      </div>
    </div>
  );
};
export default MoneyInColumn;
