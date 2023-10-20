import {
  Dispatch,
  RefObject,
  SetStateAction,
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
import { ResizeSensor } from "css-element-queries";

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

  const drawTables = (
    multiPayments: MultiPaymentBreakdown[],
    numberOfColumns: number,
  ) => {
    const newMultiPayments: MultiPaymentBreakdown[] = [];
    let lastX = 0;
    let lastY = 0;
    for (const multiPayment of multiPayments) {
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

    props.setMultiPayments(newMultiPayments);
  };

  // on initial load, set the canvas width and number of columns
  useEffect(() => {
    if (numberOfColumns === null || canvasWidth === null) {
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

      for (const multiPayment of props.multiPayments) {
        if (multiPayment.title === "") continue;
        newCategoriesRefs[multiPayment.title] =
          createCallbackRef<HTMLDivElement>((node) => {
            if (node === null) return;

            // add event listener to the node to get the height if it changes
            new ResizeSensor(node, () => {
              const height = node.clientHeight + 20;
              const theMultiPayment = props.multiPayments.find(
                (item) => item.title === multiPayment.title,
              );
              if (theMultiPayment === undefined) return;
              if (theMultiPayment.height === height) return;
              console.log(
                multiPayment.title,
                ": Bro please update my y position",
                height,
                theMultiPayment.height,
              );
              theMultiPayment.height = height;
              // just re-draw the tables with the new height
              drawTables(props.multiPayments, numberOfColumns);
            });
          });
      }
      setCategoriesRefs(newCategoriesRefs);
    }
  }, [props.multiPayments]);

  // on window resize, update the canvas width
  useEffect(() => {
    const onResize = () => {
      console.log("going to update the canvas width, due to window resize");
      if (!rightSideScrollElement) return;
      if (!rightSideScrollElement.current) return;
      setCanvasWidth(rightSideScrollElement.current.clientWidth - 20);
      let numberOfColumns = Math.floor(
        (rightSideScrollElement.current.clientWidth - 20) / 250,
      );
      if (numberOfColumns === 0) numberOfColumns = 1;
      setNumberOfColumns(numberOfColumns);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      onLayoutChange={(layout: Layout[]) => {
        for (const layoutItem of layout) {
          props.setMultiPayments((prev) => {
            const theMultiPayment = prev.find(
              (item) => item.title === layoutItem.i,
            );
            if (theMultiPayment === undefined) return prev;
            if (
              theMultiPayment.columns === undefined ||
              theMultiPayment.columns === null
            )
              theMultiPayment.columns = {};
            // if the x and y are the same, then don't update
            if (
              theMultiPayment.columns[numberOfColumns] !== undefined &&
              theMultiPayment.columns[numberOfColumns] !== null &&
              theMultiPayment.columns[numberOfColumns].x === layoutItem.x &&
              theMultiPayment.columns[numberOfColumns].y === layoutItem.y
            )
              return prev;

            theMultiPayment.columns[numberOfColumns] = {
              x: layoutItem.x,
              y: layoutItem.y,
            };
            return [...prev];
          });
        }
      }}
      isResizable={false}
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
