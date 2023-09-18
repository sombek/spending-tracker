import { useEffect, useRef } from "react";
import { HotColumn, HotTable } from "@handsontable/react";
import { CellChange } from "handsontable/common";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";

interface DataTableProps {
  data: MultiPaymentBreakdown[] | Transaction[];
  onAfterChange: (changes: CellChange[] | null, source: string) => void;
  onAfterRemoveRow: () => void;
  isMultiPayments: boolean;
  title?: string;
}

const DataTable = (props: DataTableProps) => {
  const hotTableComponentRef = useRef<HotTable>(null);

  useEffect(() => {
    const current = hotTableComponentRef.current;
    if (current === null) return;
    const hot = current.hotInstance;
    if (hot === null) return;

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
      keys: [
        ["Alt", "Meta", "Backspace"],
        ["Alt", "Meta", "Delete"],
      ],
      callback: () => {
        // delete the selected row
        const selectedRow = hot.getSelected();
        if (selectedRow === void 0) throw new Error("No selected row found");

        hot.alter("remove_row", selectedRow[0][0]);
      },
    });
  }, []);

  return (
    <>
      <HotTable
        ref={hotTableComponentRef}
        data={props.data}
        minRows={1}
        colHeaders={true}
        rowHeaders={false}
        width="100%"
        height="auto"
        autoColumnSize={true}
        contextMenu={true}
        afterRemoveRow={props.onAfterRemoveRow}
        afterChange={props.onAfterChange}
        stretchH={"all"}
        colWidths={"100%"}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn title={"Name"} data={"title"} />
        <HotColumn
          title={props.title ? props.title : "Amount"}
          data={props.isMultiPayments ? "purchases" : "amount"}
          readOnly={props.isMultiPayments}
          renderer={(
            instance,
            td,
            row,
            col,
            prop,
            value: Transaction[] | number | null,
          ) => {
            const formatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "SAR",
            });
            if (value === null || value === undefined) {
              td.innerHTML = formatter.format(0);
              // update the value in the data
              if (props.isMultiPayments) {
                const data = instance.getData() as MultiPaymentBreakdown[];
                data[row].purchases = [];
                instance.setDataAtRowProp(row, "purchases", []);
              } else {
                instance.setDataAtRowProp(row, "amount", 0);
              }

              return td;
            }

            if (!props.isMultiPayments) {
              // the value is a number
              value = value as number;
              td.innerHTML = formatter.format(value);
              return td;
            }

            // the value is an array of purchases
            value = value as Transaction[];
            const sum = value.reduce((sum, purchase) => {
              if (purchase.amount === null || purchase.amount === undefined)
                return sum;

              return sum + +purchase.amount;
            }, 0);

            td.innerHTML = formatter.format(sum);
            return td;
          }}
        />
      </HotTable>
    </>
  );
};

export default DataTable;
