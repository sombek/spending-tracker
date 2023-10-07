import { forwardRef, RefObject, useContext, useState } from "react";

import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";
import { PlusIcon } from "@heroicons/react/24/outline";

const CategoryTable = forwardRef<
  HTMLDivElement,
  {
    tableRef?: RefObject<HotTable>;
    title: string;
    multiPayments: MultiPaymentBreakdown[];
    setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  }
>((props, ref) => {
  const rightSideScrollContext = useContext(RightSideScrollContext);

  const [categoryPurchases] = useState<Transaction[]>(() => {
    const categoryRow = props.multiPayments.find(
      (payment) => payment.title === props.title,
    );
    if (categoryRow === undefined) throw new Error("No category row found");
    return categoryRow.purchases;
  });

  function updateCategoryPurchases() {
    const categoryRow = props.multiPayments.find(
      (payment) => payment.title === props.title,
    );
    if (categoryRow === undefined) throw new Error("No category row found");
    categoryRow.purchases = categoryPurchases || [];
    props.setMultiPayments([...props.multiPayments]);
  }

  return (
    <div ref={ref} data-title={props.title} className={"category-table"}>
      <div className="flex justify-between" style={{ marginBottom: 10 }}>
        <span
          className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
          id={props.title}
        >
          <h2>{props.title}</h2>
        </span>
        <div className="flex items-center">
          <div className="flex items-center">
            <PlusIcon
              className={
                "h-4 w-4 text-gray-400 cursor-pointer mr-2 hover:text-gray-700 transition-colors"
              }
              onClick={() => {
                categoryPurchases.push({
                  title: "",
                  amount: 0,
                });
                updateCategoryPurchases();
              }}
            />
          </div>

          <svg
            className={
              "h-4 w-4 text-gray-400 cursor-move draggable-handle hover:text-gray-700 transition-colors"
            }
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g fill="currentColor">
              <path d="M249.5 17.4c-1.6.8-15 13.5-29.7 28.2-28.7 29-29 29.3-27.3 38.1.9 4.9 6.9 10.9 11.8 11.8 7.9 1.5 10.3.2 23.4-12.8L240 70.6l.2 63.7c.3 62.4.3 63.6 2.4 66.3 3.9 5.3 7.1 6.9 13.4 6.9 6.3 0 9.5-1.6 13.4-6.9 2.1-2.7 2.1-3.9 2.4-66.3l.2-63.7 12.3 12.1c13.1 13 15.5 14.3 23.4 12.8 4.9-.9 10.9-6.9 11.8-11.8 1.7-8.8 1.4-9.1-27.3-38.1-14.7-14.7-28.1-27.4-29.9-28.2-4-1.7-8.9-1.7-12.8 0zM73.5 193.4c-1.6.8-15 13.5-29.7 28.2-28.8 29-28.9 29.3-27.3 38.2.5 3.2 4.4 7.5 28.3 31.4 29.9 29.9 30.1 30 38.9 28.3 4.9-.9 10.9-6.9 11.8-11.8 1.5-7.9.2-10.3-12.8-23.4L70.6 272l63.7-.2c62.4-.3 63.6-.3 66.3-2.4 5.3-3.9 6.9-7.1 6.9-13.4 0-6.3-1.6-9.5-6.9-13.4-2.7-2.1-3.9-2.1-66.3-2.4l-63.7-.2 12.1-12.3c9.8-9.9 12.3-12.9 12.8-16 2.5-13.2-10.1-23.7-22-18.3zM425.5 193.4c-4.1 1.8-8.3 6.9-9.1 11.1-1.4 7.7 0 10.2 12.9 23.2l12.1 12.3-63.7.2c-62.4.3-63.6.3-66.3 2.4-5.3 3.9-6.9 7.1-6.9 13.4 0 6.3 1.6 9.5 6.9 13.4 2.7 2.1 3.9 2.1 66.3 2.4l63.7.2-12.1 12.3c-13 13.1-14.3 15.5-12.8 23.4.9 4.9 6.9 10.9 11.8 11.8 8.8 1.7 9 1.6 38.9-28.3 23.9-23.9 27.8-28.2 28.3-31.5 1.6-8.8 1.5-9.1-27.3-38.1-14.7-14.7-28.1-27.4-29.9-28.2-4-1.7-8.9-1.7-12.8 0zM249.5 305.4c-3.7 1.7-7 5.2-8.4 8.9-.7 1.9-1.1 23.4-1.1 65v62.1l-12.2-12.1c-13.2-13-15.6-14.3-23.5-12.8-4.9.9-10.9 6.9-11.8 11.8-1.7 8.8-1.6 9 28.3 38.9 29.9 29.9 30 30 39 28.3 3.2-.5 7.5-4.4 31.4-28.3 29.9-29.9 30-30.1 28.3-38.9-.9-4.9-6.9-10.9-11.8-11.8-7.9-1.5-10.3-.2-23.4 12.8L272 441.4l-.2-63.7c-.3-62.4-.3-63.6-2.4-66.3-1.1-1.5-3.2-3.7-4.6-4.7-3.4-2.5-11.3-3.2-15.3-1.3z" />
            </g>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <DataTable
          scrollRef={rightSideScrollContext}
          tableRef={props.tableRef}
          isMultiPayments={false}
          data={categoryPurchases}
          onAfterChange={(changes) => {
            if (changes === null) return;
            updateCategoryPurchases();
          }}
          onAfterRemoveRow={updateCategoryPurchases}
        />
      </div>
    </div>
  );
});

export default CategoryTable;
