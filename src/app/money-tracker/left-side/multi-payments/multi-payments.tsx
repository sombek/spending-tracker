import DataTable from "components/data-table";
import { CellChange } from "handsontable/common";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import { RefObject, useState } from "react";
import { HotTable } from "@handsontable/react";
import Xarrow from "react-xarrows";

const MultiPayments = (props: {
  scrollRef: RefObject<HTMLDivElement> | null;
  tableRef: RefObject<HotTable>;
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
      if (category.title === null) category.title = "";
      if (category.height === undefined) category.height = null;
      if (category.columns === undefined) category.columns = {};

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

  const [currentSelectedCategory, setCurrentSelectedCategory] = useState<
    string | null
  >(null);
  return (
    <>
      {/*<span className="flex justify-end">*/}
      {/*  <div className={styles.tooltip}>*/}
      {/*    <QuestionMarkCircleIcon*/}
      {/*      className="h-5 w-5 text-gray-400 cursor-pointer"*/}
      {/*      onClick={() => setShowPopOver(!showPopOver)}*/}
      {/*    />*/}
      {/*    <span className={styles.tooltiptext} style={{ zIndex: 200 }}>*/}
      {/*      <p>*/}
      {/*        Here you create a list of categories that you want to track your*/}
      {/*        expenses against.*/}
      {/*      </p>*/}
      {/*      <hr />*/}
      {/*      <p>*/}
      {/*        For example: Groceries , Eating Out, Trip to Honolulu 🏝️, etc.*/}
      {/*      </p>*/}
      {/*    </span>*/}
      {/*  </div>*/}
      {/*</span>*/}

      <div className="mt-2">
        <DataTable
          scrollRef={props.scrollRef}
          tableRef={props.tableRef}
          title={"Sum"}
          isMultiPayments={true}
          data={props.data}
          onAfterChange={afterChange}
          onAfterRemoveRow={afterRemoveRow}
          onSelection={(row: number) => {
            const category = props.data[row];
            if (category === undefined) return;
            console.log(category.title);
            if (!category.title) {
              setCurrentSelectedCategory(null);
              return;
            }
            setCurrentSelectedCategory(category.title);
          }}
          onDeselection={() => setCurrentSelectedCategory(null)}
          tableTitle={
            <div className="tooltip tooltip-open" data-tip="hello">
              <span className="font-medium text-red-900">
                💸 Category Based Expenses
              </span>
            </div>
          }
        />
      </div>
      {currentSelectedCategory !== null && (
        <Xarrow
          arrowBodyProps={{
            strokeWidth: 2,
          }}
          start={`def-${currentSelectedCategory}`}
          startAnchor={"right"}
          end={currentSelectedCategory}
          endAnchor={"left"}
          divContainerStyle={{ zIndex: 200 }}
        />
      )}
    </>
  );
};
export default MultiPayments;
