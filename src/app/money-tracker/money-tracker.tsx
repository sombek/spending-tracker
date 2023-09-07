import MoneyInColumn from "app/money-tracker/money-in-column/money-in-column";
import MoneyOutColumn from "app/money-tracker/money-out-column/money-out-column";
import { useEffect, useState } from "react";

import {
  BudgetBreakdownJson,
  getYearMonthData,
  MultiPaymentBreakdown,
  Transaction,
  upsertBudget,
} from "infrastructure/backend-service";
import LoadingSpinner from "components/loading";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MoneyTracker() {
  const { getAccessTokenSilently } = useAuth0();

  const [moneyIn, setMoneyIn] = useState<Transaction[]>([]);

  const [singlePayments, setSinglePayments] = useState<Transaction[]>([]);

  const [multiPayments, setMultiPayments] = useState<MultiPaymentBreakdown[]>(
    [],
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
    setIsFirstTime(false);
    // and avoid sending data when the data is just being fetched
    if (isFirstTime) return;
    console.log("updating data", cleanedMultiPayments);

    const updatedMultiPayments: BudgetBreakdownJson = {
      moneyIn: cleanedMoneyIn.map<Transaction>((transaction) => ({
        title: transaction.title,
        amount: transaction.amount,
      })),
      singlePayments: cleanedSinglePayments.map<Transaction>((transaction) => ({
        title: transaction.title,
        amount: transaction.amount,
      })),
      multiPayments: cleanedMultiPayments.map<MultiPaymentBreakdown>(
        (category) => ({
          title: category.title,
          purchases: category.purchases.map<Transaction>((transaction) => ({
            title: transaction.title,
            amount: transaction.amount,
          })),
        }),
      ),
    };
    getAccessTokenSilently().then((access_token) => {
      upsertBudget(+year, +month, updatedMultiPayments, access_token).catch(
        (error) => {
          console.error(error);
        },
      );
    });
  }, [moneyIn, singlePayments, multiPayments]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const access_token = await getAccessTokenSilently();

      if (!year || !month) throw new Error("Year or month not provided");
      const data = await getYearMonthData(+year, +month, access_token);
      console.log(data);
      setIsLoading(false);
      setMoneyIn(data.moneyIn);
      setSinglePayments(data.singlePayments);
      setMultiPayments(data.multiPayments);
      console.log(moneyIn, singlePayments, multiPayments);
    };

    fetchData().catch((error) => {
      throw error;
    });
  }, []);

  if (isLoading) return <LoadingSpinner />;
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
