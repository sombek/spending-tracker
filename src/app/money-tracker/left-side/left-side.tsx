import { RefObject, useContext, useMemo, useState } from "react";
import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";
import OneTimePayments from "app/money-tracker/left-side/one-time-payments/one-time-payments";
import MultiPayments from "app/money-tracker/left-side/multi-payments/multi-payments";
import ResultsTable from "app/money-tracker/left-side/results-table";
import { LeftSideScrollContext } from "app/money-tracker/money-tracker";

const LeftSide = (props: {
  tableRefs: {
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
  };
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  tableRef: RefObject<HotTable>;
  moneyIn: Transaction[];
  setMoneyIn: (data: Transaction[]) => void;
  lastMonthMoneyRemaining: number | null;
}) => {
  const leftSideScrollContext = useContext(LeftSideScrollContext);
  const [updatedMoneyIn, setUpdatedMoneyIn] = useState<Transaction[]>(() => {
    if (
      props.lastMonthMoneyRemaining === 0 ||
      props.lastMonthMoneyRemaining === null
    )
      return props.moneyIn;

    const newMoneyIn = [...props.moneyIn];
    // check if there is last month money remaining added to the money in, update the number
    const alreadyAddedLastMonthMoneyRemaining = newMoneyIn.find(
      (payment) => payment.title === "Last Month Money Remaining",
    );
    if (alreadyAddedLastMonthMoneyRemaining !== undefined)
      alreadyAddedLastMonthMoneyRemaining.amount =
        props.lastMonthMoneyRemaining;
    // add the last month money remaining to the money in
    else
      newMoneyIn.push({
        title: "Last Month Money Remaining",
        amount: props.lastMonthMoneyRemaining,
      });

    return newMoneyIn;
  });
  const totalMoneyIn = useMemo(() => {
    if (updatedMoneyIn === undefined) return 0;
    return updatedMoneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [updatedMoneyIn]);
  const sumOfMoneyIn = useMemo(() => {
    if (updatedMoneyIn === undefined) return 0;
    return updatedMoneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [updatedMoneyIn]);

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
    <>
      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-900 ring-1 ring-inset ring-indigo-700/10">
        💰Money In
      </span>
      <div className="mt-2">
        <DataTable
          scrollRef={leftSideScrollContext}
          tableRef={props.tableRef}
          isMultiPayments={false}
          data={updatedMoneyIn}
          // data is being updated by the hot table
          // just need to create a copy of the data and update the state
          onAfterChange={(changes) => {
            if (changes === null) return;
            setUpdatedMoneyIn([...updatedMoneyIn]);
            props.setMoneyIn(updatedMoneyIn);
          }}
          onAfterRemoveRow={() => {
            setUpdatedMoneyIn([...updatedMoneyIn]);
            props.setMoneyIn(updatedMoneyIn);
          }}
        />
        <div style={{ marginTop: 2 }}>
          <ResultsTable
            totalMoneyOut={sumOfMoneyOut}
            totalMoneyIn={totalMoneyIn}
            totalMoneyLeft={sumOfMoneyRemaining}
            daysUntilNextPaycheck={25}
            whatToShow={["TOTAL_MONEY_IN"]}
          />
        </div>
      </div>
      {/*Divider*/}
      <hr className="my-2 border-green-800" />
      <OneTimePayments
        scrollRef={leftSideScrollContext}
        tableRef={props.tableRefs.singlePayments}
        singlePayments={props.singlePayments}
        setSinglePayments={props.setSinglePayments}
      />
      <div className="mt-2">
        <MultiPayments
          scrollRef={leftSideScrollContext}
          tableRef={props.tableRefs.multiPayments}
          setMultiPayments={props.setMultiPayments}
          data={props.multiPayments}
        />
        <div style={{ marginTop: 2 }}>
          <ResultsTable
            totalMoneyOut={sumOfMoneyOut}
            totalMoneyIn={totalMoneyIn}
            totalMoneyLeft={sumOfMoneyRemaining}
            daysUntilNextPaycheck={25}
            whatToShow={["TOTAL_MONEY_OUT"]}
          />
        </div>
      </div>
      {/*Divider*/}
      <hr className="my-2 border-green-800" />
      <div style={{ marginTop: 5 }}>
        <ResultsTable
          totalMoneyOut={sumOfMoneyOut}
          totalMoneyIn={totalMoneyIn}
          totalMoneyLeft={sumOfMoneyRemaining}
          daysUntilNextPaycheck={25}
          whatToShow={["TOTAL_MONEY_LEFT", "DAYS_UNTIL_NEXT_PAYCHECK"]}
        />
      </div>
    </>
  );
};
export default LeftSide;
