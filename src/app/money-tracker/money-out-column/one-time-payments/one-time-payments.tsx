import { PurchaseViewModel } from "app/money-tracker/money-out-column/category-view-model";
import { CellChange } from "handsontable/common";
import DataTable from "components/data-table";

const OneTimePayments = (props: {
  singlePayments: PurchaseViewModel[];
  setSinglePayments: (data: PurchaseViewModel[]) => void;
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
