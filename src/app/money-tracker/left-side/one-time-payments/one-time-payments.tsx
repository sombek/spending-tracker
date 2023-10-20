import { CellChange } from "handsontable/common";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";
import { RefObject } from "react";
import { HotTable } from "@handsontable/react";
import MoveAndAddRowAndTitleElement from "app/money-tracker/MoveAndAddRowAndTitleElement";

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
    <>
      <MoveAndAddRowAndTitleElement
        title={"💸 Monthly Commitments"}
        bgColor={"red"}
        hotTableComponentRef={props.tableRef}
        hideMoveIcon
      />
      <DataTable
        scrollRef={props.scrollRef}
        tableRef={props.tableRef}
        isMultiPayments={false}
        data={props.singlePayments}
        onAfterChange={afterChange}
        onAfterRemoveRow={() =>
          props.setSinglePayments([...props.singlePayments])
        }
      />
    </>
  );
};

export default OneTimePayments;
