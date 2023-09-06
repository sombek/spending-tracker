import { CellChange } from "handsontable/common";
import DataTable from "components/data-table";
import { Transaction } from "infrastructure/backend-service";

const OneTimePayments = (props: {
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
}) => {
  function afterChange(changes: CellChange[] | null, source: string) {
    if (changes === null) return;
    if (source !== "edit") return;
    props.setSinglePayments([...props.singlePayments]);
  }

  return (
    <div>
      <h2>One Time Payments</h2>
      <hr />
      <div className="mt-2">
        <DataTable
          isMultiPayments={false}
          data={props.singlePayments}
          onAfterChange={afterChange}
          onAfterRemoveRow={() =>
            props.setSinglePayments([...props.singlePayments])
          }
        />
      </div>
    </div>
  );
};

export default OneTimePayments;
