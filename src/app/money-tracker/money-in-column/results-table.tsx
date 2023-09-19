import { useMemo } from "react";
import { HotColumn, HotTable } from "@handsontable/react";

const ResultsTable = (props: {
  totalMoneyIn: number;
  totalMoneyOut: number;
  totalMoneyLeft: number;
  daysUntilNextPaycheck: number;
}) => {
  const data = useMemo(() => {
    return [
      {
        title: "Total Money In",
        amount: props.totalMoneyIn,
      },
      {
        title: "Total Money Out",
        amount: props.totalMoneyOut,
      },
      {
        title: "Total Money Left",
        amount: props.totalMoneyLeft,
      },
      {
        title: "Days Until Salary",
        amount: props.daysUntilNextPaycheck,
      },
    ];
  }, [
    props.totalMoneyIn,
    props.totalMoneyOut,
    props.totalMoneyLeft,
    props.daysUntilNextPaycheck,
  ]);
  return (
    <div>
      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-900 ring-1 ring-inset ring-indigo-700/10">
        Results
      </span>
      <div className="mt-2">
        <HotTable
          data={data}
          colHeaders={false}
          rowHeaders={false}
          width="100%"
          height="auto"
          autoColumnSize={true}
          readOnly={true}
          disableVisualSelection={true}
          contextMenu={true}
          stretchH={"all"}
          colWidths={"100%"}
          licenseKey="non-commercial-and-evaluation"
        >
          <HotColumn
            data="title"
            title="Title"
            width="100%"
            renderer={(instance, td, row, col, prop, value) => {
              // use yellow for even and green for odd
              td.style.background = "#FDE68A";
              // bold the text
              td.style.fontWeight = "bold";
              // return the modified cell
              td.innerHTML = value;
              return value;
            }}
          />
          <HotColumn
            data="amount"
            title="Amount"
            width="90%"
            renderer={(instance, td, row, col, prop, value) => {
              // show the amount in green if it's positive
              // show the amount in red if it's negative
              if (value < 0) {
                td.style.color = "#EF4444";
              }
              // return the modified cell
              // if it's not days until salary
              if (row !== 3) {
                td.innerHTML = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "SAR",
                }).format(value);
              } else {
                // days or day
                td.innerHTML = value + " day" + (value > 1 ? "s" : "");
              }
              return value;
            }}
          />
        </HotTable>
      </div>
    </div>
  );
};
export default ResultsTable;
