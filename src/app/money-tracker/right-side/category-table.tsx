import { forwardRef, RefObject, useContext, useState } from "react";

import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";

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
    <div ref={ref} data-title={props.title}>
      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
        <h2>{props.title}</h2>
      </span>

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
