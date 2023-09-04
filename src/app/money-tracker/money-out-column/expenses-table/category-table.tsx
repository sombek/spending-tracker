import { useEffect, useRef, useState } from "react";
import Core from "handsontable/core";
import { HotColumn, HotTable } from "@handsontable/react";
import {
  CategoryViewModel,
  PurchaseViewModel,
} from "app/money-tracker/money-out-column/category-view-model";

const CategoryTable = (props: {
  title: string;
  multiPayments: CategoryViewModel[];
  setMultiPayments: (data: CategoryViewModel[]) => void;
}) => {
  const [categoryPurchases] = useState<PurchaseViewModel[]>(() => {
    const categoryRow = props.multiPayments.find(
      (payment) => payment.title === props.title,
    );
    if (categoryRow === undefined) throw new Error("No category row found");
    return categoryRow.purchases;
  });

  const hotTableComponentRef = useRef<HotTable>(null);
  useEffect(() => {
    // @ts-ignore
    const hot: Core = hotTableComponentRef.current.hotInstance;
    if (hot === undefined) throw new Error("No hot instance found");
    const gridContext = hot.getShortcutManager().getContext("grid");
    if (gridContext === undefined) throw new Error("No grid context found");
    gridContext.addShortcut({
      group: "Insert",
      runOnlyIf: () => hot.getSelected() !== void 0,
      keys: [
        ["Alt", "ArrowDown"],
        ["Alt", "ArrowUp"],
      ],

      // @ts-ignore
      callback: (event: KeyboardEvent) => {
        const selectedRow = hot.getSelected();
        if (selectedRow === undefined) throw new Error("No selected row found");

        if (event.key === "ArrowDown") {
          // insert a new row below the selected row
          hot.alter("insert_row_below", selectedRow[0][0]);
          // change the selection to the newly inserted row
          hot.selectCell(selectedRow[0][0] + 1, 0);
        }
        //
        else if (event.key === "ArrowUp") {
          // insert a new row above the selected row
          hot.alter("insert_row_above", selectedRow[0][0]);
          // change the selection to the newly inserted row
          hot.selectCell(selectedRow[0][0], 0);
        }
      },
    });

    gridContext.addShortcut({
      group: "Delete",
      runOnlyIf: () => hot.getSelected() !== void 0,
      keys: [["Alt", "Meta", "Backspace"]],
      callback: () => {
        // delete the selected row
        const selectedRow = hot.getSelected();
        if (selectedRow === void 0) throw new Error("No selected row found");

        hot.alter("remove_row", selectedRow[0][0]);
      },
    });
  }, []);
  // on change log the sum of amount column

  return (
    <>
      <h2>{props.title}</h2>
      <hr />
      <div style={{ marginTop: "10px" }}>
        <HotTable
          ref={hotTableComponentRef}
          colHeaders={true}
          rowHeaders={false}
          // default row count when the table is initialized
          data={categoryPurchases}
          minRows={1}
          // take the proper width of the parent element
          width="100%"
          // take the proper height of the parent element
          height="auto"
          autoColumnSize={true}
          contextMenu={true}
          stretchH={"all"}
          colWidths={"100%"}
          afterChange={(changes) => {
            if (changes === null) return;
            const current = hotTableComponentRef.current;
            if (current === null) return;
            const hotInstance = current.hotInstance;
            if (hotInstance === null) return;

            const copyOfAllData: CategoryViewModel[] = [];
            Object.assign(copyOfAllData, props.multiPayments);
            const payment = copyOfAllData.find(
              (payment) => payment.title === props.title,
            );
            if (payment === undefined) throw new Error("No payment found");
            payment.purchases = categoryPurchases;

            props.setMultiPayments(copyOfAllData);
          }}
          licenseKey="non-commercial-and-evaluation"
        >
          <HotColumn title={"Name"} data={"title"} />
          <HotColumn
            title={"Amount"}
            data={"amount"}
            renderer={(instance, td, row, col, prop, value) => {
              const formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
              });
              td.innerHTML = formatter.format(value);
              return td;
            }}
          />
        </HotTable>
      </div>
    </>
  );
};

export default CategoryTable;
