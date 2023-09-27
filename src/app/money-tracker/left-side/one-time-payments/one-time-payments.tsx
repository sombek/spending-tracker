import { CellChange } from "handsontable/common";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";
import styles from "app/money-tracker/left-side/multi-payments/multi-payments.module.css";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { RefObject } from "react";
import { HotTable } from "@handsontable/react";

const OneTimePayments = (props: {
  scrollRef: RefObject<HTMLDivElement> | null;
  tableRef: RefObject<HotTable>;
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
      <div className="flex justify-end">
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
      </div>
      <div className="mt-2">
        <DataTable
          scrollRef={props.scrollRef}
          tableRef={props.tableRef}
          isMultiPayments={false}
          data={props.singlePayments}
          onAfterChange={afterChange}
          onAfterRemoveRow={() =>
            props.setSinglePayments([...props.singlePayments])
          }
          tableBackgroundColor="bg-red-100"
          tableTitle={
            <span className="font-medium text-red-900">
              💸 One Time Payments
            </span>
          }
        />
      </div>
    </div>
  );
};

export default OneTimePayments;
