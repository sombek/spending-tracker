import {
  createRef,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { HotTable } from "@handsontable/react";
import { MultiPaymentBreakdown } from "infrastructure/backend-service";
import CategoryTable from "app/money-tracker/right-side/category-table";
import GridLayout from "react-grid-layout";
import { RightSideScrollContext } from "app/money-tracker/money-tracker";

const RightSide = (props: {
  tableRefs: {
    [key: string]: RefObject<HotTable>;
  };
  multiPayments: MultiPaymentBreakdown[];
  setMultiPayments: (data: MultiPaymentBreakdown[]) => void;
}) => {
  const elementRef = useContext(RightSideScrollContext);
  const [canvasWidth, setCanvasWidth] = useState(
    // @ts-ignore
    elementRef?.current?.clientWidth - 20,
  );
  const [numberOfColumns, setNumberOfColumns] = useState(1);

  useEffect(() => {
    if (!elementRef) return;
    if (!elementRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!elementRef.current) return;
      setCanvasWidth(elementRef.current.clientWidth - 20);
      console.log(
        Math.floor(elementRef.current.clientWidth / 250),
        "number of columns",
      );
      setNumberOfColumns(Math.floor(elementRef.current.clientWidth / 250));

      const initialLayout: {
        i: string;
        x: number;
        y: number;
        w: number;
        h: number;
      }[] = [];

      const lastPosition = { x: 0, y: 0 };
      props.multiPayments.forEach((payment) => {
        if (payment.title == "") return;
        const width = 1;

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
      setLayout(initialLayout);
      console.log(initialLayout);
    });
    resizeObserver.observe(elementRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [elementRef, numberOfColumns, props.multiPayments]);

  const [layout, setLayout] = useState<
    { i: string; x: number; y: number; w: number; h: number }[]
  >(() => {
    const initialLayout: {
      i: string;
      x: number;
      y: number;
      w: number;
      h: number;
    }[] = [];

    const lastPosition = { x: 0, y: 0 };
    props.multiPayments.forEach((payment) => {
      if (payment.title == "") return;
      const width = 1;

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
    return initialLayout;
  });

  // calculateLayout();

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

  // function calculateLayout() {
  //   props.multiPayments.forEach((payment) => {
  //     if (payment.title == "") return;
  //     const width = 1;
  //
  //     // how many rows does this category have
  //     const numberOfItems = payment.purchases.length;
  //     // (numberOfItems+1 head row)*23+ 4 extra + 24 for the label + 10 for the marginTop
  //     const height = (numberOfItems + 1) * 23 + 4 + 24 + 10 + 10;
  //
  //     // make it next to each other
  //     layout.push({
  //       i: payment.title,
  //       x: lastPosition.x,
  //       y: lastPosition.y,
  //       w: width,
  //       h: height,
  //     });
  //     setLayout(layout);
  //     lastPosition.x += width;
  //     if (lastPosition.x >= numberOfColumns) {
  //       lastPosition.x = 0;
  //       lastPosition.y += height + 10;
  //     }
  //   });
  // }

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
