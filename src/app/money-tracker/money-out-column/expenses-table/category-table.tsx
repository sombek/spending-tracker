import { useState } from "react";

import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";

const CategoryTable = (props: {
  title: string;
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
}) => {
  const [categoryPurchases] = useState<Transaction[]>(() => {
    const categoryRow = props.multiPayments.find(
      (payment) => payment.title === props.title,
    );
    if (categoryRow === undefined) throw new Error("No category row found");
    return categoryRow.purchases;
  });

  function updateCategoryPurchases() {
    const categoryRow = props.multiPayments.find(
      (payment) => payment.title === props.title,
    );
    if (categoryRow === undefined) throw new Error("No category row found");
    categoryRow.purchases = categoryPurchases || [];
    props.setMultiPayments([...props.multiPayments]);
  }

  return (
    <>
      <h2>{props.title}</h2>
      <hr />
      <div className="mt-2">
        <DataTable
          isMultiPayments={false}
          data={categoryPurchases}
          onAfterChange={(changes) => {
            if (changes === null) return;
            updateCategoryPurchases();
          }}
          onAfterRemoveRow={updateCategoryPurchases}
        />
      </div>
    </>
  );
};

export default CategoryTable;
