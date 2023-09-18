import { CellChange } from "handsontable/common";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";
import styles from "app/money-tracker/money-out-column/multi-payments/multi-payments.module.css";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const OneTimePayments = (props: {
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
}) => {
  function afterChange(changes: CellChange[] | null, source: string) {
    if (changes === null) return;
    if (source !== "edit") return;
    props.setSinglePayments([...props.singlePayments]);
  }

  return (
    <div>
      <span className="flex justify-between">
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          <h2>One Time Payments</h2>
        </span>

        <div className={styles.tooltip}>
          <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
          <span className={styles.tooltiptext} style={{ zIndex: 200 }}>
            <p>
              List down the one time payments for this month. Usually these are
              fixed payments that you have to make every month.
            </p>
            <hr />
            <p>For example: Rent, Car Installment.</p>
          </span>
        </div>
      </span>

      <div className="mt-2">
        <DataTable
          isMultiPayments={false}
          data={props.singlePayments}
          onAfterChange={afterChange}
          onAfterRemoveRow={() =>
            props.setSinglePayments([...props.singlePayments])
          }
        />
      </div>
    </div>
  );
};

export default OneTimePayments;
