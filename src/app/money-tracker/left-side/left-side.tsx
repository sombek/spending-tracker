import { RefObject, useContext, useMemo } from "react";
import DataTable from "components/data-table";
import {
  MultiPaymentBreakdown,
  Transaction,
} from "infrastructure/backend-service";
import { HotTable } from "@handsontable/react";
import OneTimePayments from "app/money-tracker/left-side/one-time-payments/one-time-payments";
import MultiPayments from "app/money-tracker/left-side/multi-payments/multi-payments";
import { LeftSideScrollContext } from "app/money-tracker/money-tracker";
import MoveAndAddRowAndTitleElement from "app/money-tracker/MoveAndAddRowAndTitleElement";

const LeftSide = (props: {
  setShowTour: (showTour: boolean) => void;
  tableRefs: {
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
  };
  singlePayments: Transaction[];
  setSinglePayments: (data: Transaction[]) => void;
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
  tableRef: RefObject<HotTable>;
  moneyIn: Transaction[];
  setMoneyIn: (data: Transaction[]) => void;
}) => {
  const leftSideScrollContext = useContext(LeftSideScrollContext);

  const randomEmoji = useMemo(() => {
    return ["💰", "💸", "💵", "💴", "💶", "💷"].sort(
      () => Math.random() - 0.5,
    )[0];
  }, []);

  return (
    <>
      <div data-tour="1-step">
        <MoveAndAddRowAndTitleElement
          title={"💰Money In"}
          hotTableComponentRef={props.tableRef}
          bgColor={"green"}
          hideMoveIcon
        />
        <DataTable
          scrollRef={leftSideScrollContext}
          tableRef={props.tableRef}
          isMultiPayments={false}
          data={props.moneyIn}
          // data is being updated by the hot table
          // just need to create a copy of the data and update the state
          onAfterChange={(changes) => {
            if (changes === null) return;
            props.setMoneyIn([...props.moneyIn]);
          }}
          onAfterRemoveRow={() => props.setMoneyIn([...props.moneyIn])}
        />
      </div>
      <div className="flex items-center">
        <div className="border-t border-green-800 flex-grow" />
        <div className="px-3 text-gray-800 font-bold text-2xl">
          {randomEmoji}
        </div>
        <div className="border-t  border-green-800 flex-grow" />
      </div>
      <div className="mt-2" data-tour="third-step">
        <MultiPayments
          scrollRef={leftSideScrollContext}
          tableRef={props.tableRefs.multiPayments}
          setMultiPayments={props.setMultiPayments}
          data={props.multiPayments}
        />
      </div>
      <div className="mt-4" data-tour="2-step">
        <OneTimePayments
          scrollRef={leftSideScrollContext}
          tableRef={props.tableRefs.singlePayments}
          singlePayments={props.singlePayments}
          setSinglePayments={props.setSinglePayments}
        />
      </div>
    </>
  );
};
export default LeftSide;
