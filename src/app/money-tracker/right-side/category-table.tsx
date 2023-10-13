import { forwardRef, RefObject, useContext, useState } from "react";

import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";
import MoveAndAddRowAndTitleElement from "app/money-tracker/MoveAndAddRowAndTitleElement";

const CategoryTable = forwardRef<
  HTMLDivElement,
  {
    tableRef: RefObject<HotTable>;
    parentTableRef: RefObject<HotTable>;
    title: string;
    multiPayments: MultiPaymentBreakdown[];
    setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  }
>((props, ref) => {
  const rightSideScrollContext = useContext(RightSideScrollContext);
  const categoryRow = props.multiPayments.find(
    (payment) => payment.title === props.title,
  );
  if (categoryRow === undefined) throw new Error("No category row found");

  const [categoryPurchases] = useState<Transaction[]>(() => {
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
      <MoveAndAddRowAndTitleElement
        title={props.title}
        hotTableComponentRef={props.tableRef}
        bgColor={categoryRow.color}
      />
      <DataTable
        scrollRef={rightSideScrollContext}
        tableRef={props.tableRef}
        isMultiPayments={false}
        data={categoryPurchases}
        onSelection={() => {
          if (props.parentTableRef.current === null) return;

          const hot = props.parentTableRef.current.hotInstance;
          if (hot === null) return;
          const selectedRowIndexByTitle = hot.getData().findIndex((row) => {
            return row[0] === props.title;
          });
          if (selectedRowIndexByTitle === -1) return;
          // change the css class of the td element
          const selectedRow = hot.getCell(selectedRowIndexByTitle, 0);
          if (selectedRow === null) return;
          const parentNode = selectedRow.parentNode as HTMLTableCellElement;
          if (parentNode === null) return;
          parentNode.classList.add("selected-row");
        }}
        onDeselection={() => {
          console.log("clear selection " + props.title);
          if (props.parentTableRef.current === null) return;

          const hot = props.parentTableRef.current.hotInstance;
          if (hot === null) return;
          const selectedRowIndexByTitle = hot.getData().findIndex((row) => {
            return row[0] === props.title;
          });
          if (selectedRowIndexByTitle === -1) return;
          // change the css class of the td element
          const selectedRow = hot.getCell(selectedRowIndexByTitle, 0);
          if (selectedRow === null) return;
          const parentNode = selectedRow.parentNode as HTMLTableCellElement;
          if (parentNode === null) return;
          parentNode.classList.remove("selected-row");
        }}
        onAfterChange={(changes) => {
          if (changes === null) return;
          updateCategoryPurchases();
        }}
        onAfterRemoveRow={updateCategoryPurchases}
      />
    </div>
  );
});

export default CategoryTable;
