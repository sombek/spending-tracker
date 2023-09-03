import MoneyInColumn from "app/money-tracker/money-in-column/money-in-column";
import MoneyOutColumn from "app/money-tracker/money-out-column/money-out-column";

export default function MoneyTracker() {
  return (
    <div className={"flex flex-row"}>
      <MoneyInColumn />
      <MoneyOutColumn />
    </div>
  );
}
