import MoneyInColumn from "app/money-tracker/money-in-column/money-in-column";
import MoneyOutColumn from "app/money-tracker/money-out-column/money-out-column";
import {
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
import styles from "app/money-tracker/money-in-column/money-in-column.module.css";

const nthNumber = (number: number) => {
  return number > 0
    ? ["th", "st", "nd", "rd"][
        (number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10
      ]
    : "";
};

export default function MoneyTracker() {
  const { getAccessTokenSilently } = useAuth0();

  const budgetBreakdown = useLoaderData() as BudgetBreakdownJson;

  const [moneyIn, setMoneyIn] = useState<Transaction[]>(
    budgetBreakdown.moneyIn,
  );

  const [singlePayments, setSinglePayments] = useState<Transaction[]>(
    budgetBreakdown.singlePayments,
  );

  const [multiPayments, setMultiPayments] = useState<MultiPaymentBreakdown[]>(
    budgetBreakdown.multiPayments,
  );
  const [tablesRefs, setTablesRefs] = useState<{
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
  }>({
    moneyIn: useRef<HotTable>(null),
    singlePayments: useRef<HotTable>(null),
    multiPayments: useRef<HotTable>(null),
  });
  // on budget breakdown update, update the state
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

  // year, and month are going to be in the route
  const { year, month } = useParams();
  // on each update on the data, we need to update the state in backend
  // so that we can save the data
  useEffect(() => {
    if (!year || !month) throw new Error("Year or month not provided");
    // remove empty transactions
    const cleanedMoneyIn = moneyIn.filter(
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
      moneyIn: cleanedMoneyIn,
      singlePayments: cleanedSinglePayments,
      multiPayments: cleanedMultiPayments,
    };
    getAccessTokenSilently().then((access_token) => {
      upsertBudget(+year, +month, updatedMultiPayments, access_token).catch(
        (error) => {
          console.error(error);
        },
      );
    });
  }, [
    moneyIn,
    singlePayments,
    multiPayments,
    year,
    month,
    getAccessTokenSilently,
  ]);

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

  useEffect(() => {
    // if clicked option + 1 select money in table
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
        let selectedTable = tablesRefs.multiPayments;
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
  const lastMonthText = useMemo(() => {
    if (month === undefined) throw new Error("Month is undefined");
    if (month === "1") return "December";
    const monthNumber = +month - 2;
    return new Date(0, monthNumber).toLocaleString("default", {
      month: "long",
    });
  }, [month]);
  const thisMonthText = useMemo(() => {
    if (month === undefined) throw new Error("Month is undefined");
    if (month === "12") return "January";
    return new Date(0, +month - 1).toLocaleString("default", {
      month: "long",
    });
  }, [month]);

  return (
    <>
      <div>
        <div className={styles.moneyInHeader}>
          <div>
            📆 Budget from
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mr-1 ml-1">
              {lastMonthText} 26{nthNumber(26)}
            </span>
            To
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mr-1 ml-1">
              {thisMonthText} 26{nthNumber(26)}
            </span>
          </div>
        </div>
      </div>
      <div className={"flex flex-row"}>
        <MoneyInColumn
          tableRef={tablesRefs.moneyIn}
          moneyIn={moneyIn}
          setMoneyIn={setMoneyIn}
        />
        <MoneyOutColumn
          tableRefs={tablesRefs}
          moneyIn={moneyIn}
          singlePayments={singlePayments}
          setSinglePayments={setSinglePayments}
          multiPayments={multiPayments}
          setMultiPayments={setMultiPayments}
        />
      </div>

      <button
        className={
          "fixed bottom-20 left-0 m-4 p-2 rounded-full bg-blue-500 text-white"
        }
        onClick={() => setOpen(true)}
      >
        <QuestionMarkCircleIcon className={"h-6 w-6"} />
      </button>
      <ShortcutsModal setOpen={setOpen} open={open} />
    </>
  );
}
