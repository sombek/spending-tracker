import DataTable from "components/data-table";
import { CellChange } from "handsontable/common";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";

const MultiPayments = (props: {
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  data: MultiPaymentBreakdown[];
}) => {
  function afterChange(changes: CellChange[] | null, source: string) {
    if (changes === null) return;
    if (source !== "edit") return;

    // data is being updated by the hot table
    // just need to create a copy of the data and update the state
    const copyOfData: MultiPaymentBreakdown[] = [];
    // add empty array purchases for each category
    // if it doesn't exist
    props.data.forEach((category) => {
      if (category.purchases === undefined) category.purchases = [];
      copyOfData.push(category);
    });

    Object.assign(copyOfData, props.data);
    props.setMultiPayments(copyOfData);
  }

  function afterRemoveRow() {
    // data is being updated by the hot table
    // just need to create a copy of the data and update the state
    const copyOfData: MultiPaymentBreakdown[] = [];
    Object.assign(copyOfData, props.data);
    props.setMultiPayments(copyOfData);
  }

  return (
    <>
      <h2>Multi Payments</h2>
      <hr />
      <div className="mt-2">
        <DataTable
          isMultiPayments={true}
          data={props.data}
          onAfterChange={afterChange}
          onAfterRemoveRow={afterRemoveRow}
        />
      </div>
    </>
  );
};
export default MultiPayments;
