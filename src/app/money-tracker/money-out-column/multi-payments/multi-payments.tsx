import { CategoryViewModel } from "app/money-tracker/money-out-column/category-view-model";
import DataTable from "app/money-tracker/money-out-column/multi-payments/data-table";

const MultiPayments = (props: {
  setMultiPayments: (data: CategoryViewModel[]) => void;
  data: CategoryViewModel[];
}) => {
  return (
    <>
      <h2>Multi Payments</h2>
      <hr />
      <div className="mt-2">
        <DataTable
          title="Multi Payments"
          isMultiPayments={true}
          data={props.data}
          setMultiPayments={props.setMultiPayments}
        />
      </div>
    </>
  );
};
export default MultiPayments;
