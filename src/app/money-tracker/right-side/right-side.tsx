import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { HotTable } from "@handsontable/react";
import {
  MultiPaymentBreakdown,
  TablePosition,
} from "infrastructure/backend-service";
import CategoryTable from "app/money-tracker/right-side/category-table";
import GridLayout, { Layout } from "react-grid-layout";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";
import { createCallbackRef } from "use-callback-ref";

const RightSide = (props: {
  tableRefs: {
    moneyIn: RefObject<HotTable>;
    singlePayments: RefObject<HotTable>;
    multiPayments: RefObject<HotTable>;
    [key: string]: RefObject<HotTable>;
  };
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: Dispatch<SetStateAction<MultiPaymentBreakdown[]>>;
}) => {
  const rightSideScrollElement = useContext(RightSideScrollContext);

  const [canvasWidth, setCanvasWidth] = useState<number | null>(null);
  const [numberOfColumns, setNumberOfColumns] = useState<number | null>(null);
  const [categoriesRefs, setCategoriesRefs] = useState<{
    [key: string]: RefObject<HTMLDivElement>;
  }>({});

  const initializeCanvasWidth = useCallback(
    (multiPayments?: MultiPaymentBreakdown[]) => {
      if (multiPayments === undefined) multiPayments = props.multiPayments;

      if (!rightSideScrollElement) return;
      if (!rightSideScrollElement.current) return;
      setCanvasWidth(rightSideScrollElement.current.clientWidth - 20);
      let numberOfColumns = Math.floor(
        (rightSideScrollElement.current.clientWidth - 20) / 250,
      );
      if (numberOfColumns === 0) numberOfColumns = 1;
      setNumberOfColumns(numberOfColumns);

      const newCategoriesRefs: {
        [key: string]: RefObject<HTMLDivElement>;
      } = {};

      const newMultiPayments: MultiPaymentBreakdown[] = [];
      let lastX = 0;
      let lastY = 0;
      for (const multiPayment of multiPayments) {
        if (multiPayment.title === "") continue;

        newCategoriesRefs[multiPayment.title] =
          createCallbackRef<HTMLDivElement>((node) => {
            if (node === null) return;
            const height = node.clientHeight + 10;
            if (height === undefined) return;

            props.setMultiPayments((prev: MultiPaymentBreakdown[]) => {
              const theMultiPayment = prev.find(
                (item) => item.title === multiPayment.title,
              );

              if (theMultiPayment === undefined) return prev;
              theMultiPayment.height = height;
              return prev;
            });
          });

        const newMultiPayment = {
          ...multiPayment,
        };
        if (multiPayment.height === null || multiPayment.height === undefined)
          newMultiPayment.height = 1;

        if (
          newMultiPayment.columns === undefined ||
          newMultiPayment.columns === null
        )
          newMultiPayment.columns = {};
        if (!newMultiPayment.columns.hasOwnProperty(numberOfColumns))
          newMultiPayment.columns[numberOfColumns] = {
            x: null,
            y: null,
          };
        const currentColumnPosition = newMultiPayment.columns[numberOfColumns];
        if (currentColumnPosition.x === null) currentColumnPosition.x = lastX;
        if (currentColumnPosition.y === null) currentColumnPosition.y = lastY;

        newMultiPayments.push(newMultiPayment);
        lastX += 1;
        if (lastX >= numberOfColumns) {
          lastX = 0;
          lastY += 1;
        }
      }

      // update the props
      setCategoriesRefs(newCategoriesRefs);
      props.setMultiPayments(newMultiPayments);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rightSideScrollElement],
  );
  const [lastMultiPayments, setLastMultiPayments] = useState<
    MultiPaymentBreakdown[]
  >(JSON.parse(JSON.stringify(props.multiPayments)));

  // when adding new row, re-add the ref
  useEffect(() => {
    // if there is difference in the number of rows, then update the canvas width
    // debugger;

    let shouldReinitializeCanvasWidth = false;
    let reason = "no reason";
    for (const multiPayment of props.multiPayments) {
      if (multiPayment.title === "") continue;
      // check with lastMultiPayments
      const lastMultiPayment = lastMultiPayments.find(
        (item) => item.title === multiPayment.title,
      );
      if (lastMultiPayment === undefined) {
        shouldReinitializeCanvasWidth = true;
        reason = "lastMultiPayment === undefined";
        break;
      }
      if (lastMultiPayment.purchases.length !== multiPayment.purchases.length) {
        shouldReinitializeCanvasWidth = true;
        reason = `${lastMultiPayment.title} purchases is different`;
        break;
      }
      // if the content length is different, then update the canvas width
      for (const purchase of multiPayment.purchases) {
        const lastPurchase = lastMultiPayment.purchases.find(
          (item) => item.title === purchase.title,
        );
        if (lastPurchase === undefined) {
          shouldReinitializeCanvasWidth = true;
          reason = "lastPurchase === undefined";
          break;
        }
        if (lastPurchase.title !== purchase.title) {
          shouldReinitializeCanvasWidth = true;
          reason = "lastPurchase.title !== purchase.title";
          break;
        }
      }
    }
    if (shouldReinitializeCanvasWidth) {
      console.log("going to update the canvas width, due to " + reason);
      setLastMultiPayments(JSON.parse(JSON.stringify(props.multiPayments)));
      initializeCanvasWidth(props.multiPayments);
    }
  }, [initializeCanvasWidth, lastMultiPayments, props.multiPayments]);
  useEffect(
    () => initializeCanvasWidth(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // on window resize, update the canvas width
  useEffect(() => {
    const onResize = () => initializeCanvasWidth();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [initializeCanvasWidth]);

  const onLayoutChange = useCallback(
    (layout: Layout[], numberOfColumns: number | null) => {
      const newCategoriesRefs: {
        [key: string]: RefObject<HTMLDivElement>;
      } = {};
      if (numberOfColumns === null) return;
      // update the x, y, height
      props.setMultiPayments((prev: MultiPaymentBreakdown[]) => {
        const newMultiPayments: MultiPaymentBreakdown[] = [];
        for (const multiPayment of prev) {
          const layoutItem = layout.find(
            (item) => item.i === multiPayment.title,
          );
          if (layoutItem === undefined) continue;
          if (
            multiPayment.columns === undefined ||
            multiPayment.columns === null
          )
            multiPayment.columns = {};
          if (!multiPayment.columns.hasOwnProperty(numberOfColumns))
            multiPayment.columns[numberOfColumns] = {
              x: null,
              y: null,
            };

          const currentColumnPosition = multiPayment.columns[numberOfColumns];
          currentColumnPosition.x = layoutItem.x;
          currentColumnPosition.y = layoutItem.y;

          multiPayment.height = layoutItem.h;
          newMultiPayments.push(multiPayment);

          newCategoriesRefs[multiPayment.title] =
            createCallbackRef<HTMLDivElement>((node) => {
              if (node === null) return;
              const height = node.clientHeight + 10;
              if (height === undefined) return;
              props.setMultiPayments((prev: MultiPaymentBreakdown[]) => {
                const theMultiPayment = prev.find(
                  (item) => item.title === multiPayment.title,
                );

                if (theMultiPayment === undefined) return prev;
                theMultiPayment.height = height;
                return prev;
              });
            });
        }
        return newMultiPayments;
      });
      setCategoriesRefs(newCategoriesRefs);
    },
    [props],
  );

  if (canvasWidth === null || numberOfColumns === null) {
    return (
      <div>
        <div className="flex justify-center items-center h-full w-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <GridLayout
      width={canvasWidth}
      cols={numberOfColumns}
      rowHeight={1}
      margin={[0, 0]}
      isResizable={false}
      onLayoutChange={(layout) => onLayoutChange(layout, numberOfColumns)}
      draggableHandle={".draggable-handle"}
    >
      {props.multiPayments.map((payment) => {
        if (payment.columns === undefined || payment.columns === null) {
          console.log(payment, "payment is null");
          return null;
        }
        if (!payment.columns.hasOwnProperty(numberOfColumns)) {
          console.log(payment, "payment is null");
          return null;
        }
        const position: TablePosition = payment.columns[numberOfColumns];

        const title = payment.title;
        if (
          title === null ||
          title === undefined ||
          title === "" ||
          title === " "
        )
          return null;

        return (
          <div
            key={title}
            data-grid={{
              x: position.x || 0,
              y: position.y || 0,
              w: 1,
              h: payment.height || 1,
            }}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <CategoryTable
              ref={categoriesRefs[title]}
              tableRef={props.tableRefs[title]}
              parentTableRef={props.tableRefs.multiPayments}
              title={title}
              multiPayments={props.multiPayments}
              setMultiPayments={props.setMultiPayments}
            />
          </div>
        );
      })}
    </GridLayout>
  );
};

export default RightSide;
