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
  const randomEmoji = useMemo(() => {
    return ["💰", "💸", "💵", "💴", "💶", "💷"].sort(
      () => Math.random() - 0.5,
    )[0];
  }, []);

  const randomEmoji2 = useMemo(() => {
    return ["💰", "💸", "💵", "💴", "💶", "💷"].sort(
      () => Math.random() - 0.5,
    )[0];
  }, []);

  return (
    <>
      <div>
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
          tableTitle={
            <span className="font-medium text-green-900"> 💰Money In</span>
          }
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
      <div className="flex items-center">
        <div className="border-t border-green-800 flex-grow" />
        <div className="px-3 text-gray-800 font-bold text-2xl">
          {randomEmoji}
        </div>
        <div className="border-t  border-green-800 flex-grow" />
      </div>
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
      <div className="flex items-center">
        <div className="border-t border-green-800 flex-grow" />
        <div
          className="px-3 text-gray-800 font-bold text-2xl cursor-pointer"
          onClick={() => {
            // say a joke about money tracking
            const moneyJokes = [
              "Why did the dollar go to therapy? It had too many issues with commitment – always leaving people's wallets!",
              "Why did the penny apply for a job? It wanted to make some cents!",
              "What's a financial planner's favorite game? Hide and seek – because they love finding hidden expenses!",
              "How do you make a small fortune in the stock market? Start with a large fortune!",
              "Why did the piggy bank go to the doctor? It was feeling a little 'bankrupt'!",
              "What's a mathematician's favorite type of money? Square root currency – it always makes sense!",
              "Why do cashiers always look so calm? Because they know how to stay balanced!",
              "Why did the banker switch careers? He lost interest!",
              "Why did the coin take a vacation? It needed to 'unwind'!",
              "How do you become a millionaire? Start as a billionaire and then invest in your favorite hobby until you're left with a million dollars!",
              "What did one dollar say to the other dollar? 'You're worth a lot to me.'",
              "Why did the scarecrow become a successful banker? Because he was outstanding in his field!",
              "What's a vampire's favorite type of money? Blood money!",
              "Why did the computer keep putting money in the blender? It wanted to make liquid assets!",
              "Why was the math book sad? It had too many problems!",
              "What do you call a rich elf? Welfy!",
              "Why did the wallet go to therapy? It had too many emotional attachments!",
              "What's a financial wizard's favorite spell? Abra-cadabra, now your debt's gone!",
              "Why don't scientists trust atoms? Because they make up everything – even financial excuses!",
              "Why was the math book looking sad? It had too many problems!",
              "What do you call a coin that works in a bank? A change agent!",
              "Why did the accountant break up with the calculator? It just couldn't count on it anymore!",
              "Why did the credit card go to therapy? It had too much debt baggage!",
              "What's a hedge fund manager's favorite type of plant? A money tree!",
              "Why did the investor bring a ladder to the bank? To check out their high-interest rates!",
              "Why did the accountant go broke? They lost their balance!",
              "Why did the dollar go to school? To get a little 'cents' of education!",
              "Why did the coin go to the doctor? It felt a bit 'off'!",
              "What do you call a bear with no money? A 'bear' left!",
              "Why did the wallet apply for a loan? It wanted to expand its 'pocket' size!",
            ];
            const randomJoke = moneyJokes.sort(() => Math.random() - 0.5)[0];
            alert(randomJoke);
          }}
        >
          {randomEmoji2}
        </div>
        <div className="border-t  border-green-800 flex-grow" />
      </div>
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
