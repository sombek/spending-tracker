import {
  createRef,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { HotTable } from "@handsontable/react";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import CategoryTable from "app/money-tracker/right-side/category-table";
import GridLayout, { Layout } from "react-grid-layout";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";

const RightSide = (props: {
  tableRefs: {
    [key: string]: RefObject<HotTable>;
  };
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
}) => {
  const rightSideScrollElement = useContext(RightSideScrollContext);
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null);
  const [numberOfColumns, setNumberOfColumns] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  // initialize the layout
  const initialLayout = useCallback(() => {
    if (numberOfColumns === null) return [];

    const initialLayout: Layout[] = [];
    const lastPosition = { x: 0, y: 0 };
    const width = 1;

    props.multiPayments.forEach((payment) => {
      if (payment.title == "") return;

      // how many rows does this category have
      const numberOfItems = payment.purchases.length;
      // (numberOfItems+1 head row)*23+ 4 extra + 24 for the label + 10 for the marginTop
      const height = (numberOfItems + 1) * 23 + 4 + 24 + 10 + 10;

      // make it next to each other
      initialLayout.push({
        i: payment.title,
        x: lastPosition.x,
        y: lastPosition.y,
        w: width,
        h: height,
      });
      lastPosition.x += width;
      if (lastPosition.x >= numberOfColumns) {
        lastPosition.x = 0;
        lastPosition.y += height;
      }
    });
    setIsInitialized(true);
    return initialLayout;
  }, [numberOfColumns, props.multiPayments]);

  const [layout, setLayout] = useState<Layout[]>(() => initialLayout());

  const initializeCanvasWidth = useCallback(() => {
    if (!rightSideScrollElement) return;
    if (!rightSideScrollElement.current) return;
    setCanvasWidth(rightSideScrollElement.current.clientWidth - 20);
    setNumberOfColumns(
      Math.floor((rightSideScrollElement.current.clientWidth - 20) / 250),
    );
  }, [rightSideScrollElement]);

  // observe the width of the canvas, and update the canvas width
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      initializeCanvasWidth();
      setLayout(initialLayout());
    });

    if (!rightSideScrollElement) return;
    if (!rightSideScrollElement.current) return;
    resizeObserver.observe(rightSideScrollElement.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [rightSideScrollElement, initializeCanvasWidth, initialLayout]);

  const categoryTableRefs = useRef(
    props.multiPayments.reduce(
      (acc, payment) => {
        return {
          ...acc,
          [payment.title]: createRef<HTMLDivElement>(),
        };
      },
      {} as { [key: string]: RefObject<HTMLDivElement> },
    ),
  );
  if (canvasWidth === null || numberOfColumns === null || !isInitialized)
    return (
      <div>
        <div className="flex justify-center items-center h-full w-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );

  return (
    <GridLayout
      className="layout"
      layout={layout}
      width={canvasWidth}
      cols={numberOfColumns}
      rowHeight={1}
      margin={[0, 0]}
      isResizable={false}
      onLayoutChange={(layout) => {
        setLayout(layout);
      }}
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
            ref={categoryTableRefs.current[payment.title]}
            key={title}
            style={{
              maxWidth: 250,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <CategoryTable
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
