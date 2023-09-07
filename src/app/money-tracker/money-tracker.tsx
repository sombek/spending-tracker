import MoneyInColumn from "app/money-tracker/money-in-column/money-in-column";
import MoneyOutColumn from "app/money-tracker/money-out-column/money-out-column";
import { useEffect, useState } from "react";

import {
  BudgetBreakdownJson,
  MultiPaymentBreakdown,
  Transaction,
  upsertBudget,
} from "infrastructure/backend-service";
import { useLoaderData, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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
  }, [moneyIn, singlePayments, multiPayments]);

  return (
    <div className={"flex flex-row"}>
      <MoneyInColumn moneyIn={moneyIn} setMoneyIn={setMoneyIn} />
      <MoneyOutColumn
        moneyIn={moneyIn}
        singlePayments={singlePayments}
        setSinglePayments={setSinglePayments}
        multiPayments={multiPayments}
        setMultiPayments={setMultiPayments}
      />
    </div>
  );
}
