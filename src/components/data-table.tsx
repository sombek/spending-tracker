import { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { HotColumn, HotTable } from "@handsontable/react";
import { CellChange } from "handsontable/common";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import Core from "handsontable/core";

interface DataTableProps {
  scrollRef?: RefObject<HTMLDivElement> | null;
  data: MultiPaymentBreakdown[] | Transaction[];
  onAfterChange: (changes: CellChange[] | null, source: string) => void;
  onAfterRemoveRow: () => void;
  isMultiPayments: boolean;
  title?: string;
  tableTitle?: ReactElement;
  tableRef?: RefObject<HotTable>;
  tableBackgroundColor?: string;
  onSelection?: (row: number) => void;
  onDeselection?: () => void;
}

const addXButtonToCell = (
  td: HTMLTableCellElement,
  instance: Core,
  row: number,
) => {
  // add small x button to the right of the cell
  // if there is x-button, then don't add it again
  if (td.querySelector("#x-button") !== null) return td;
  td.style.position = "relative";
  const xButton = document.createElement("button");
  xButton.id = "x-button";
  xButton.innerHTML = "<span>❌</span>";
  xButton.style.position = "absolute";
  // make it center vertically right
  xButton.style.top = "50%";
  xButton.style.transform = "translateY(-50%)";
  xButton.style.right = "0";

  // xButton.style.border = "none";
  // xButton.style.background = "red";
  xButton.style.color = "rgba(0,0,0,0.2)";
  xButton.style.opacity = "0.5";
  // on hover
  xButton.addEventListener("mouseenter", () => {
    xButton.style.color = "rgba(0,0,0,1)";
    xButton.style.opacity = "1";
  });
  xButton.addEventListener("mouseleave", () => {
    xButton.style.color = "rgba(0,0,0,0.2)";
    xButton.style.opacity = "0.5";
  });
  // transparent background on hover
  xButton.style.cursor = "pointer";
  xButton.style.fontSize = "6px";
  xButton.style.fontWeight = "500";
  xButton.style.padding = "0px 2px 0px 0px";
  xButton.addEventListener("click", () => instance.alter("remove_row", row));
  td.appendChild(xButton);
};

const DataTable = (props: DataTableProps) => {
  let hotTableComponentRef = useRef<HotTable>(null);
  if (props.tableRef !== undefined) hotTableComponentRef = props.tableRef;

  useEffect(() => {
    const current = hotTableComponentRef.current;
    if (current === null) return;
    const hot = current.hotInstance;
    if (hot === null) return;

    const gridContext = hot.getShortcutManager().getContext("grid");
    if (gridContext === undefined) throw new Error("No grid context found");
    const scrollToCell = (cell: HTMLTableCellElement | null) => {
      if (cell === null) throw new Error("No cell found");
      if (props.scrollRef === undefined || props.scrollRef === null) return;
      if (props.scrollRef.current === null) return;
      // scroll to the newly inserted row
      props.scrollRef.current.scrollTo({
        top: cell.offsetTop,
        behavior: "smooth",
      });
    };

    gridContext.addShortcut({
      group: "Insert",
      runOnlyIf: () => hot.getSelected() !== void 0,
      keys: [["Alt", "ArrowDown"], ["Alt", "ArrowUp"], ["Enter"]],

      // @ts-ignore
      callback: (event: KeyboardEvent) => {
        const selectedRow = hot.getSelected();
        if (selectedRow === undefined) throw new Error("No selected row found");

        if (event.key === "ArrowDown") {
          // insert a new row below the selected row
          hot.alter("insert_row_below", selectedRow[0][0]);
          // change the selection to the newly inserted row
          hot.selectCell(selectedRow[0][0] + 1, 0);

          const cell = hot.getCell(selectedRow[0][0] + 1, 0);
          scrollToCell(cell);
        }
        //
        else if (event.key === "ArrowUp") {
          // insert a new row above the selected row
          hot.alter("insert_row_above", selectedRow[0][0]);
          // change the selection to the newly inserted row
          hot.selectCell(selectedRow[0][0], 0);

          const cell = hot.getCell(selectedRow[0][0], 0);
          scrollToCell(cell);
        } //
        else if (event.key === "Enter") {
          // insert a new row below the selected row if the selected row is the last row
          if (selectedRow[0][0] === hot.countRows() - 1) {
            hot.alter("insert_row_below", selectedRow[0][0]);
            // change the selection to the newly inserted row
            hot.selectCell(selectedRow[0][0] + 1, 0);
            const cell = hot.getCell(selectedRow[0][0] + 1, 0);
            scrollToCell(cell);
          }
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
        const currentSelectedCell = hot.getSelected();
        if (currentSelectedCell === void 0)
          throw new Error("No selected cell found");
        scrollToCell(hot.getCell(currentSelectedCell[0][0], 0));
      },
    });
  }, [props.scrollRef]);
  const [nestedHeaders] = useState<
    Array<Array<string | { label: string; colspan: number }>>
  >([
    [
      { label: "Title", colspan: 1 },
      {
        label: props.isMultiPayments ? "Sum" : "Amount",
        colspan: 1,
      },
    ],
  ]);
  // useEffect(() => {
  //   if (props.tableTitle !== undefined)
  //     setNestedHeaders([
  //       [{ label: "table-title", colspan: 2 }],
  //       [
  //         { label: "Title", colspan: 1 },
  //         { label: "Amount", colspan: 1 },
  //       ],
  //     ]);
  // }, [props.tableTitle]);

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
        nestedHeaders={nestedHeaders}
        afterSelection={(row) => props.onSelection?.(row)}
        afterDeselect={() => props.onDeselection?.()}
        beforeOnCellMouseDown={(event, coords) => {
          if (coords.row < 0) {
            event.stopImmediatePropagation();
          }
        }}
        // contextMenu={true}
        afterRemoveRow={props.onAfterRemoveRow}
        afterChange={props.onAfterChange}
        stretchH={"all"}
        colWidths={"100%"}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn
          title={"Name"}
          data={"title"}
          renderer={(instance, td, row, col, prop, value) => {
            // make the text bold
            if (value === null || value === undefined) return td;
            td.style.fontWeight = "500";
            // clean the text from \n and \r
            value = value.replace(/[\n\r]+/g, "");
            td.innerHTML = value;
            // // update the value in the data
            // instance.setDataAtRowProp(row, "title", value);

            return td;
          }}
        />
        <HotColumn
          title={props.title ? props.title : "Amount"}
          data={props.isMultiPayments ? "purchases" : "amount"}
          readOnly={props.isMultiPayments}
          disableVisualSelection={props.isMultiPayments}
          renderer={(
            instance,
            td,
            row,
            col,
            prop,
            value: Transaction[] | number | null | string,
          ) => {
            if (typeof value === "string") {
              if (value.toString().match(/[\u0660-\u0669]/g))
                value = value
                  // @ts-ignore
                  .replace(/[\u0660-\u0669]/g, (c) => c.charCodeAt(0) - 0x0660);

              // it could be currency, and we need to convert it to number
              value = value.replace(/[^0-9.-]+/g, "");
              value = +value;

              // update the value in the data
              if (props.isMultiPayments) {
                const data = instance.getData() as MultiPaymentBreakdown[];
                data[row].purchases = [];
                instance.setDataAtRowProp(row, "purchases", []);
              }
              instance.setDataAtRowProp(row, "amount", value);
            }

            const formatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "SAR",
              maximumFractionDigits: 0,
            });
            td.style.textAlign = "center";

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
              addXButtonToCell(td, instance, row);
              return td;
            }

            if (!props.isMultiPayments) {
              // the value is a number
              value = value as number;
              td.innerHTML = formatter.format(value);
              addXButtonToCell(td, instance, row);
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
            addXButtonToCell(td, instance, row);
            const title = instance.getDataAtRowProp(row, "title");
            if (title === null || title === undefined) return td;
            td.id = "def-" + title;

            return td;
          }}
        />
      </HotTable>
    </>
  );
};

export default DataTable;
