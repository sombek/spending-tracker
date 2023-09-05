import MoneyInColumn from "app/money-tracker/money-in-column/money-in-column";
import MoneyOutColumn from "app/money-tracker/money-out-column/money-out-column";
import { useState } from "react";
import {
  CategoryViewModel,
  PurchaseViewModel,
} from "app/money-tracker/money-out-column/category-view-model";

export default function MoneyTracker() {
  const [moneyIn, setMoneyIn] = useState<PurchaseViewModel[]>([
    {
      title: "Salary",
      amount: 0,
    },
    {
      title: "Other",
      amount: 0,
    },
  ]);

  // single payments
  const [singlePayments, setSinglePayments] = useState<PurchaseViewModel[]>([
    {
      title: "Rent",
      amount: 0,
    },
    {
      title: "Food",
      amount: 0,
    },
  ]);

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
