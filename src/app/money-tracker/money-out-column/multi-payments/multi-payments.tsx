import { HotColumn, HotTable } from "@handsontable/react";
import { useEffect, useRef } from "react";
import Core from "handsontable/core";
import { CellChange } from "handsontable/common";

const MultiPayments = (props: {
  setMultiPayments: (data: [string, number][]) => void;
  data: [string, number][];
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

  function afterChange(changes: CellChange[] | null) {
    if (changes === null) return;
    console.log(changes);
    const copyOfData: [string, number][] = [];
    Object.assign(copyOfData, props.data);

    for (const change of changes) {
      const row = change[0];
      const column = change[1];
      if (typeof column !== "number") throw new Error("Invalid row or column");

      copyOfData[row][column] = change[3];
    }

    console.log(copyOfData);

    props.setMultiPayments(copyOfData);
  }

  return (
    <>
      <h2>Multi Payments</h2>
      <hr />
      <div style={{ marginTop: "10px" }}>
        <HotTable
          ref={hotTableComponentRef}
          data={props.data}
          colHeaders={true}
          rowHeaders={false}
          // take the proper width of the parent element
          width="100%"
          // take the proper height of the parent element
          height="auto"
          autoColumnSize={true}
          contextMenu={true}
          afterChange={afterChange}
          stretchH={"all"}
          colWidths={"100%"}
          licenseKey="non-commercial-and-evaluation"
        >
          <HotColumn title={"Name"} />
          <HotColumn title={"Amount"} readOnly={true} />
        </HotTable>
      </div>
    </>
  );
};
export default MultiPayments;
