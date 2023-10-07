import { CellChange } from "handsontable/common";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";
import { RefObject } from "react";
import { HotTable } from "@handsontable/react";

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
    <DataTable
      scrollRef={props.scrollRef}
      tableRef={props.tableRef}
      isMultiPayments={false}
      data={props.singlePayments}
      onAfterChange={afterChange}
      onAfterRemoveRow={() =>
        props.setSinglePayments([...props.singlePayments])
      }
      tableBackgroundColor="bg-red-100"
      tableTitle={
        <span className="font-medium text-red-900">💸 One Time Payments</span>
      }
    />
  );
};

export default OneTimePayments;
