import { HotColumn, HotTable } from "@handsontable/react";
import { useEffect, useRef } from "react";
import Core from "handsontable/core";

const MultiPayments = () => {
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
  return (
    <>
      <h2>Multi Payments</h2>
      <hr />
      <div style={{ marginTop: "10px" }}>
        <HotTable
          ref={hotTableComponentRef}
          data={[
            // data of category based payments
            // e.g: Bills, Groceries, Restaurants & Cafe,
            ["Bills", 300],
            ["Groceries", 200],
            ["Restaurants & Cafe", 150],
          ]}
          colHeaders={true}
          rowHeaders={false}
          // take the proper width of the parent element
          width="100%"
          // take the proper height of the parent element
          height="auto"
          autoColumnSize={true}
          contextMenu={true}
          stretchH={"all"}
          colWidths={"100%"}
          licenseKey="non-commercial-and-evaluation"
        >
          <HotColumn title={"Name"} />
          <HotColumn title={"Amount"} />
        </HotTable>
      </div>
    </>
  );
};
export default MultiPayments;
