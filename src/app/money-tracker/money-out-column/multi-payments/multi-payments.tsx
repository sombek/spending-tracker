import DataTable from "components/data-table";
import { CellChange } from "handsontable/common";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import styles from "./multi-payments.module.css";

const MultiPayments = (props: {
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  data: MultiPaymentBreakdown[];
}) => {
  function afterChange(changes: CellChange[] | null, source: string) {
    if (changes === null) return;
    if (source !== "edit") return;

    // data is being updated by the hot table
    // just need to create a copy of the data and update the state
    const copyOfData: MultiPaymentBreakdown[] = [];
    // add empty array purchases for each category
    // if it doesn't exist
    props.data.forEach((category) => {
      if (category.purchases === undefined) category.purchases = [];
      if (category.title === null) category.title = "";
      copyOfData.push(category);
    });

    Object.assign(copyOfData, props.data);
    props.setMultiPayments(copyOfData);
  }

  function afterRemoveRow() {
    // data is being updated by the hot table
    // just need to create a copy of the data and update the state
    const copyOfData: MultiPaymentBreakdown[] = [];
    Object.assign(copyOfData, props.data);
    props.setMultiPayments(copyOfData);
  }

  const [showPopOver, setShowPopOver] = useState(false);
  return (
    <>
      <span className="flex justify-between">
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
          <h2>Category Based Expenses</h2>
        </span>

        <div className={styles.tooltip}>
          <QuestionMarkCircleIcon
            className="h-5 w-5 text-gray-400 cursor-pointer"
            onClick={() => setShowPopOver(!showPopOver)}
          />
          <span className={styles.tooltiptext} style={{ zIndex: 200 }}>
            <p>
              Here you create a list of categories that you want to track your
              expenses against.
            </p>
            <hr />
            <p>
              For example: Groceries , Eating Out, Trip to Honolulu 🏝️, etc.
            </p>
          </span>
        </div>
      </span>

      <div className="mt-2">
        <DataTable
          title={"Sum"}
          isMultiPayments={true}
          data={props.data}
          onAfterChange={afterChange}
          onAfterRemoveRow={afterRemoveRow}
        />
      </div>
    </>
  );
};
export default MultiPayments;
