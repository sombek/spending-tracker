import { HotColumn, HotTable } from "@handsontable/react";
import { useEffect, useRef } from "react";

import "pikaday/css/pikaday.css";
import Core from "handsontable/core";
import { PurchaseViewModel } from "app/money-tracker/money-out-column/category-view-model";
import { CellChange } from "handsontable/common";

const OneTimePayments = (props: {
  singlePayments: PurchaseViewModel[];
  setSinglePayments: (data: PurchaseViewModel[]) => void;
}) => {
  const hotTableComponentRef = useRef(null);
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

  function afterChange(changes: CellChange[] | null, source: string) {
    if (changes === null) return;
    if (source !== "edit") return;

    // data is being updated by the hot table
    // just need to create a copy of the data and update the state
    const copyOfData: PurchaseViewModel[] = [];
    Object.assign(copyOfData, props.singlePayments);
    props.setSinglePayments(copyOfData);
  }

  function afterRemoveRow() {
    // data is being updated by the hot table
    // just need to create a copy of the data and update the state
    const copyOfData: PurchaseViewModel[] = [];
    Object.assign(copyOfData, props.singlePayments);
    props.setSinglePayments(copyOfData);
  }

  return (
    <div>
      <h2>One Time Payments</h2>
      <hr />
      <div style={{ marginTop: "10px" }}>
        <HotTable
          ref={hotTableComponentRef}
          data={props.singlePayments}
          colHeaders={true}
          rowHeaders={false}
          // take the proper width of the parent element
          width="100%"
          // take the proper height of the parent element
          height="auto"
          autoColumnSize={true}
          contextMenu={true}
          afterRemoveRow={afterRemoveRow}
          afterChange={afterChange}
          stretchH={"all"}
          colWidths={"100%"}
          licenseKey="non-commercial-and-evaluation"
        >
          <HotColumn title={"Name"} data={"title"} />
          <HotColumn
            title={"Amount"}
            data={"amount"}
            renderer={(instance, td, row, col, prop, value: number | null) => {
              const formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
              });
              if (value === null || value === undefined) value = 0;

              td.innerHTML = formatter.format(value);
              return td;
            }}
          />
        </HotTable>
      </div>
    </div>
  );
};

export default OneTimePayments;
