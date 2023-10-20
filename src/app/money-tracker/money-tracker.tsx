import LeftSide from "app/money-tracker/left-side/left-side";
import {
  createContext,
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Tour, { ReactourStep } from "reactour";

import {
  BudgetBreakdownJson,
  MultiPaymentBreakdown,
  Transaction,
  upsertBudget,
} from "infrastructure/backend-service";
import { useLoaderData, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ShortcutsModal from "app/money-tracker/shortcuts-modal";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { HotTable } from "@handsontable/react";
import styles from "app/money-tracker/money-tracker.module.css";
import RightSide from "app/money-tracker/right-side/right-side";
import RightTopBar from "app/money-tracker/right-top-bar/RightTopBar";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";

function ErrorToast(props: { show: boolean }) {
  if (!props.show) return null;

  return (
    <div
      className={
        "bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md fade-out"
      }
      style={{
        visibility: props.show ? "visible" : "hidden",
      }}
      role="error"
    >
      <div className="flex">
        <div className="py-1">
          <svg
            className="fill-current h-6 w-6 text-red-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Failed to save data</p>
          <p className="text-xs">Try to refresh the page</p>
        </div>
      </div>
    </div>
  );
}

const RightSideScrollContext = createContext<RefObject<HTMLDivElement> | null>(
  null,
);
const LeftSideScrollContext = createContext<RefObject<HTMLDivElement> | null>(
  null,
);

export { RightSideScrollContext, LeftSideScrollContext };

export default function MoneyTracker() {
  const rightSideScrollRef = useRef<HTMLDivElement>(null);
  const leftSideScrollRef = useRef<HTMLDivElement>(null);
  // year, and month are going to be in the route
  const { year, month } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  const budgetBreakdown = useLoaderData() as BudgetBreakdownJson;

  const [singlePayments, setSinglePayments] = useState<Transaction[]>(
    budgetBreakdown.singlePayments,
  );
  const [fromSalary, setFromSalary] = useState<Date>(() => {
    if (!budgetBreakdown.fromSalary) {
      // if from salary is not provided, use the current month from param
      const dateWithMonthFromParam = moment(`${year}-${month}-25`);
      if (dateWithMonthFromParam.isValid())
        return dateWithMonthFromParam.toDate();
      return new Date();
    }
    // int time stamp to date
    console.log("budgetBreakdown.fromSalary:", budgetBreakdown.fromSalary);
    return new Date(budgetBreakdown.fromSalary);
  });

  const [toSalary, setToSalary] = useState<Date>(() => {
    console.log("month", month);
    if (!budgetBreakdown.toSalary) {
      // if to salary is not provided, use the current month + 1
      // 25th of the month

      const dateWithMonthFromParam = moment(`${year}-${month}-25`);
      if (dateWithMonthFromParam.isValid()) {
        dateWithMonthFromParam.add(1, "months");
        return dateWithMonthFromParam.toDate();
      }
    }
    return new Date(budgetBreakdown.toSalary);
  });

  const [multiPayments, setMultiPayments] = useState<MultiPaymentBreakdown[]>(
    () => {
      // make sure each multi payment has a color
      return budgetBreakdown.multiPayments.map((multiPayment) => {
        // use one of these COLORS
        // if (multiPayment.color === undefined) {
        multiPayment.color = "blue";
        // }
        return multiPayment;
      });
    },
  );

  const [updatedMoneyIn, setUpdatedMoneyIn] = useState<Transaction[]>(() => {
    if (
      budgetBreakdown.lastMonthMoneyRemaining === 0 ||
      budgetBreakdown.lastMonthMoneyRemaining === null
    )
      return budgetBreakdown.moneyIn;

    const newMoneyIn = [...budgetBreakdown.moneyIn];
    // check if there is last month money remaining added to the money in, update the number
    const alreadyAddedLastMonthMoneyRemaining = newMoneyIn.find(
      (payment) => payment.title === "Last Month Money Remaining",
    );
    if (alreadyAddedLastMonthMoneyRemaining !== undefined)
      alreadyAddedLastMonthMoneyRemaining.amount =
        budgetBreakdown.lastMonthMoneyRemaining;
    // add the last month money remaining to the money in
    else
      newMoneyIn.push({
        title: "Last Month Money Remaining",
        amount: budgetBreakdown.lastMonthMoneyRemaining,
      });

    return newMoneyIn;
  });

  const sumOfMoneyIn = useMemo(() => {
    if (updatedMoneyIn === undefined) return 0;
    return updatedMoneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [updatedMoneyIn]);

  const sumOfMoneyOut = useMemo(() => {
    if (multiPayments === undefined) return 0;
    const multiPaymentsSum = multiPayments.reduce((sum, payment) => {
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

    const singlePaymentsSum = singlePayments.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);

    return multiPaymentsSum + singlePaymentsSum;
  }, [multiPayments, singlePayments]);

  const sumOfMoneyRemaining = useMemo(() => {
    return sumOfMoneyIn - sumOfMoneyOut;
  }, [sumOfMoneyOut, sumOfMoneyIn]);

  const [tablesRefs, setTablesRefs] = useState<{
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
  }>({
    moneyIn: useRef<HotTable>(null),
    singlePayments: useRef<HotTable>(null),
    multiPayments: useRef<HotTable>(null),
  });
  // on budget breakdown update, update the state for table refs
  useEffect(() => {
    for (const multiPayment of multiPayments) {
      setTablesRefs((prev) => {
        return {
          ...prev,
          [multiPayment.title]: createRef<HotTable>(),
        };
      });
    }
  }, [multiPayments]);

  // on each update on the data, we need to update the state in backend
  // so that we can save the data
  useEffect(() => {
    if (!year || !month) throw new Error("Year or month not provided");
    // remove empty transactions
    const cleanedMoneyIn = updatedMoneyIn.filter(
      (transaction) => Object.keys(transaction).length !== 0,
    );
    const cleanedSinglePayments = singlePayments.filter(
      (transaction) => Object.keys(transaction).length !== 0,
    );
    const cleanedMultiPayments = multiPayments.filter(
      (transaction) => Object.keys(transaction).length !== 0,
    );

    if (
      cleanedMoneyIn.length === 0 &&
      cleanedSinglePayments.length === 0 &&
      cleanedMultiPayments.length === 0
    )
      return;

    const updatedMultiPayments: BudgetBreakdownJson = {
      // to number time stamp
      fromSalary: Date.parse(fromSalary.toISOString()),
      toSalary: Date.parse(toSalary.toISOString()),
      moneyIn: cleanedMoneyIn,
      singlePayments: cleanedSinglePayments,
      multiPayments: cleanedMultiPayments,
      lastMonthMoneyRemaining: null,
    };
    getAccessTokenSilently().then((access_token) => {
      upsertBudget(+year, +month, updatedMultiPayments, access_token).catch(
        (error) => {
          setShowErrorToast(true);
          setTimeout(() => setShowErrorToast(false), 3000);
          console.error(error);
        },
      );
    });
    // wait 3 seconds, then hide the error toast
  }, [updatedMoneyIn, singlePayments, multiPayments, fromSalary, toSalary]);

  const [showTour, setShowTour] = useState<boolean>(
    Boolean(budgetBreakdown.showTour),
  );

  const [open, setOpen] = useState(false);
  // when click cmd + /, toggle the shortcuts modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "/") {
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // alt + right or left to jump to another table
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // right arrow
      if (event.altKey && event.key === "ArrowRight") {
        let selectedTable = tablesRefs.moneyIn;
        let getSelectedTable = false;
        for (const tableRef of Object.values(tablesRefs)) {
          if (getSelectedTable) {
            selectedTable = tableRef;
            break;
          }

          if (tableRef.current === null) continue;
          const hot = tableRef.current.hotInstance;
          if (hot === null) continue;
          if (hot.getSelected()) {
            // deselect the current table
            hot.deselectCell();
            getSelectedTable = true;
          }
        }
        selectedTable.current?.hotInstance?.selectCell(0, 0);
      }
      // left arrow
      else if (event.altKey && event.key === "ArrowLeft") {
        let selectedTable = Object.values(tablesRefs).reverse()[0];
        let getSelectedTable = false;
        for (const tableRef of Object.values(tablesRefs).reverse()) {
          if (getSelectedTable) {
            selectedTable = tableRef;
            break;
          }

          if (tableRef.current === null) continue;
          const hot = tableRef.current.hotInstance;
          if (hot === null) continue;
          if (hot.getSelected()) {
            // deselect the current table
            hot.deselectCell();
            getSelectedTable = true;
          }
        }
        selectedTable.current?.hotInstance?.selectCell(0, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tablesRefs]);

  const [showErrorToast, setShowErrorToast] = useState(false);
  return (
    <>
      <div>
        <div className={styles.moneyTrackerHeader}>
          <span>📆 Money Track </span>

          <div style={{ height: 24, width: 100, zIndex: 200 }}>
            <Datepicker
              value={{
                startDate: fromSalary,
                endDate: toSalary,
              }}
              toggleClassName="hidden"
              readOnly={true}
              inputClassName={(className) => {
                className =
                  "text-center cursor-pointer focus:outline-none rounded-md bg-white border border-gray-300 py-1 text-xs font-medium hover:bg-gray-50 mx-2 h-full w-full";
                return className;
              }}
              primaryColor={"blue"}
              placeholder={"loading..."}
              displayFormat={"MMM D"}
              onChange={(value) => {
                if (value === null) return;
                setFromSalary(new Date(value.startDate as string));
                setToSalary(new Date(value.endDate as string));
              }}
            />
          </div>
          <button
            className={
              "items-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 mx-3 hidden sm:inline-flex"
            }
            style={{ height: 24, paddingTop: 4, marginTop: 3 }}
            onClick={() => setShowTour(true)}
          >
            <MapPinIcon className={"h-3 w-3 mr-1 text-red-700"}></MapPinIcon>
            Show Tour
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftSide} ref={leftSideScrollRef}>
          <LeftSideScrollContext.Provider value={leftSideScrollRef}>
            <LeftSide
              setShowTour={setShowTour}
              tableRefs={tablesRefs}
              singlePayments={singlePayments}
              setSinglePayments={setSinglePayments}
              multiPayments={multiPayments}
              setMultiPayments={setMultiPayments}
              tableRef={tablesRefs.moneyIn}
              moneyIn={updatedMoneyIn}
              setMoneyIn={setUpdatedMoneyIn}
            />
          </LeftSideScrollContext.Provider>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.rightTopBar}>
            <RightTopBar
              nextSalaryDate={toSalary}
              sumOfMoneyIn={sumOfMoneyIn}
              sumOfMoneyOut={sumOfMoneyOut}
              sumOfMoneyRemaining={sumOfMoneyRemaining}
            />
          </div>
          <div
            className={styles.rightBottomBar}
            ref={rightSideScrollRef}
            data-tour="forth-step"
          >
            <RightSideScrollContext.Provider value={rightSideScrollRef}>
              <RightSide
                tableRefs={tablesRefs}
                multiPayments={multiPayments}
                setMultiPayments={setMultiPayments}
              />
            </RightSideScrollContext.Provider>
          </div>
        </div>
      </div>

      {/*Make bottom right, and h: 1/4, w: 1/4*/}
      <div className={"fixed bottom-0 right-0 m-4 p-2 fade-out"}>
        <ErrorToast show={showErrorToast} />
      </div>

      <button
        className={
          "fixed bottom-10 right-0 m-4 p-2 rounded-full bg-blue-500 text-white"
        }
        onClick={() => setOpen(true)}
      >
        <QuestionMarkCircleIcon className={"h-6 w-6"} />
      </button>
      <ShortcutsModal setOpen={setOpen} open={open} />
      <Tour
        steps={steps}
        accentColor={"#5cb1ff"}
        isOpen={showTour}
        onRequestClose={() => setShowTour(false)}
        badgeContent={(curr, tot) => `${curr} of ${tot}`}
        getCurrentStep={(curr) => {
          const currentStep = curr + 1;
          if (currentStep === 6) {
            // select first row in the multi payments table
            tablesRefs.multiPayments.current?.hotInstance?.selectCell(0, 0);
          }
        }}
      />
    </>
  );
}

const steps: ReactourStep[] = [
  {
    selector: '[data-tour="1-step"]',
    content: "In this section, you can add your money in",
  },
  {
    selector: '[data-tour="1.1-step"]',
    content: "And it should reflect here",
  },
  {
    selector: '[data-tour="2-step"]',
    content: (
      <div>
        <div className={"flex flex-row items-center"}>
          <div className={"flex flex-col"}>
            <div className={"text-sm font-medium text-gray-900"}>
              Here you can add your one time payments These are usually payments
              that is fixed every month. Examples?
            </div>
            <div className={"text-xs text-gray-500"}>
              <ul className={"list-disc list-inside"}>
                <li className={"font-medium"}>Rent</li>
                <li className={"font-medium"}>Car Payment</li>
                <li className={"font-medium"}>Saving for a trip</li>
                <li className={"font-medium"}>Saving for a marriage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    selector: '[data-tour="2.1-step"]',
    content: "Every time you add a payment, it should reflect here",
  },
  {
    selector: '[data-tour="third-step"]',
    content: (
      <div>
        <div className={"flex flex-row items-center"}>
          <div className={"flex flex-col"}>
            <div className={"text-sm font-medium text-gray-900"}>
              Here you can add your multi payments Think of this as a budget for
              the month. Examples?
            </div>
            {/*Reminder*/}
            <div className={"text-sm font-medium text-yellow-900"}>
              <span className={"font-bold"}>Reminder:</span> These are just
              definition of the budget, you still need to add the actual
              purchases in the table right side
            </div>
            <div className={"text-xs text-gray-500"}>
              <ul className={"list-disc list-inside"}>
                <li className={"font-medium"}>Groceries</li>
                <li className={"font-medium"}>Gas</li>
                <li className={"font-medium"}>Eating out</li>
                <li className={"font-medium"}>Entertainment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    selector: '[data-tour="forth-step"] .category-table',
    content: "And here you can add your purchases to each category",
    position: "top",
  },
  {
    selector: '[data-tour="2.1-step"]',
    content: "On each purchase it should also reflect here",
  },
  {
    selector: '[data-tour="4.1-step"]',
    content: "And here you can see the total money left",
  },
  // ...
];
