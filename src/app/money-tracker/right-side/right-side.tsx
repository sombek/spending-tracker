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
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import CategoryTable from "app/money-tracker/right-side/category-table";
import GridLayout, { Layout } from "react-grid-layout";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";
import { createCallbackRef } from "use-callback-ref";

const RightSide = (props: {
  tableRefs: {
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
      const numberOfColumns = Math.floor(
        (rightSideScrollElement.current.clientWidth - 20) / 250,
      );
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

        if (multiPayment.x === null || multiPayment.x === undefined)
          newMultiPayment.x = lastX;
        if (multiPayment.y === null || multiPayment.y === undefined)
          newMultiPayment.y = lastY;
        if (multiPayment.height === null || multiPayment.height === undefined)
          newMultiPayment.height = 1;

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
    for (const multiPayment of props.multiPayments) {
      if (multiPayment.title === "") continue;
      // check with lastMultiPayments
      const lastMultiPayment = lastMultiPayments.find(
        (item) => item.title === multiPayment.title,
      );
      if (lastMultiPayment === undefined) {
        shouldReinitializeCanvasWidth = true;
        break;
      }
      if (lastMultiPayment.purchases.length !== multiPayment.purchases.length) {
        shouldReinitializeCanvasWidth = true;
        break;
      }
      // if the content length is different, then update the canvas width
      for (const purchase of multiPayment.purchases) {
        const lastPurchase = lastMultiPayment.purchases.find(
          (item) => item.title === purchase.title,
        );
        if (lastPurchase === undefined) {
          shouldReinitializeCanvasWidth = true;
          break;
        }
        if (lastPurchase.title !== purchase.title) {
          shouldReinitializeCanvasWidth = true;
          break;
        }
      }
    }
    if (shouldReinitializeCanvasWidth) {
      setLastMultiPayments(JSON.parse(JSON.stringify(props.multiPayments)));
      initializeCanvasWidth(props.multiPayments);
    }
  }, [initializeCanvasWidth, lastMultiPayments, props.multiPayments]);

  // observe the width of the canvas, and update the canvas width
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => initializeCanvasWidth());

    if (!rightSideScrollElement) return;
    if (!rightSideScrollElement.current) return;
    resizeObserver.observe(rightSideScrollElement.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [rightSideScrollElement, initializeCanvasWidth]);

  const onLayoutChange = useCallback(
    (layout: Layout[]) => {
      const newCategoriesRefs: {
        [key: string]: RefObject<HTMLDivElement>;
      } = {};

      // update the x, y, height
      props.setMultiPayments((prev: MultiPaymentBreakdown[]) => {
        const newMultiPayments: MultiPaymentBreakdown[] = [];
        for (const multiPayment of prev) {
          const layoutItem = layout.find(
            (item) => item.i === multiPayment.title,
          );
          if (layoutItem === undefined) continue;

          multiPayment.x = layoutItem.x;
          multiPayment.y = layoutItem.y;
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
        setCategoriesRefs(newCategoriesRefs);
        return newMultiPayments;
      });
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
      onLayoutChange={onLayoutChange}
      draggableHandle={".draggable-handle"}
    >
      {props.multiPayments.map((payment) => {
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
              x: payment.x || 0,
              y: payment.y || 0,
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
