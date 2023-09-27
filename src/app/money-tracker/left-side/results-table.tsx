import { useMemo } from "react";
import { HotColumn, HotTable } from "@handsontable/react";

const ResultsTable = (props: {
  totalMoneyIn: number;
  totalMoneyOut: number;
  totalMoneyLeft: number;
  daysUntilNextPaycheck: number;
  whatToShow: string[];
}) => {
  const data1 = useMemo(() => {
    const whatToShow = [];
    // if TOTAL_MONEY_IN is in the list of what to show, then add it to the list
    if (props.whatToShow.includes("TOTAL_MONEY_IN"))
      whatToShow.push({
        title: "Total Money In",
        amount: props.totalMoneyIn,
      });

    // if TOTAL_MONEY_OUT is in the list of what to show, then add it to the list
    if (props.whatToShow.includes("TOTAL_MONEY_OUT"))
      whatToShow.push({
        title: "Total Money Out",
        amount: props.totalMoneyOut,
      });
    return whatToShow;
  }, [props.totalMoneyIn, props.totalMoneyOut, props.whatToShow]);

  const data2 = useMemo(() => {
    function calculateDaysUntilSalaryDay(salaryDay: number) {
      // get today's date
      const today = new Date();
      // get the day of the month
      const dayOfMonth = today.getDate();
      // if the day of the month is less than the salary day, then the salary day is in the future
      if (dayOfMonth < salaryDay) {
        // return the difference between the salary day and the day of the month
        return salaryDay - dayOfMonth;
      } else {
        // if we are in the same month, then the salary day will be next month
        // return the difference between the salary day and the day of the month
        // plus the number of days in the month
        return (
          salaryDay -
          dayOfMonth +
          new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
        );
      }
    }

    const whatToShow = [];
    // if TOTAL_MONEY_LEFT is in the list of what to show, then add it to the list
    if (props.whatToShow.includes("TOTAL_MONEY_LEFT"))
      whatToShow.push({
        title: "Total Money Left",
        amount: props.totalMoneyLeft,
      });

    // if DAYS_UNTIL_NEXT_PAYCHECK is in the list of what to show, then add it to the list
    if (props.whatToShow.includes("DAYS_UNTIL_NEXT_PAYCHECK"))
      whatToShow.push({
        title: "Days Until Next Paycheck",
        amount: calculateDaysUntilSalaryDay(props.daysUntilNextPaycheck),
      });

    return whatToShow;
  }, [props.whatToShow, props.totalMoneyLeft, props.daysUntilNextPaycheck]);

  return (
    <div>
      <div>
        <HotTable
          data={data1}
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
            renderer={(instance, td, row, col, prop, value) => {
              // slighly darker yellow for even and green for odd
              td.style.backgroundImage = `linear-gradient(315deg, rgba(216, 241, 160, 0.7) 0%, rgba(243, 193, 120, 0.5) 74%), url("/noise.svg")`;
              td.style.backdropFilter = "blur(6px)";
              td.style.fontWeight = "bold";
              // return the modified cell
              td.innerHTML = value;
              return value;
            }}
          />
          <HotColumn
            data="amount"
            title="Amount"
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
                  maximumFractionDigits: 0,
                }).format(value);
                td.style.fontWeight = "bold";
              } else {
                // days or day
                td.innerHTML = value + " day" + (value > 1 ? "s" : "");
              }
              return value;
            }}
          />
        </HotTable>
      </div>
      <div>
        <HotTable
          data={data2}
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
            renderer={(instance, td, row, col, prop, value) => {
              td.style.backgroundImage = `linear-gradient(315deg, rgba(216, 241, 160, 0.7) 0%, rgba(243, 193, 120, 0.5) 74%), url("/noise.svg")`;
              td.style.backdropFilter = "blur(6px)";
              td.style.fontWeight = "bold";
              td.innerHTML = value;
              return value;
            }}
          />
          <HotColumn
            data="amount"
            title="Amount"
            renderer={(instance, td, row, col, prop, value) => {
              // show the amount in green if it's positive
              // show the amount in red if it's negative
              if (value < 0) {
                td.style.color = "#EF4444";
              }
              // return the modified cell
              // if it's not days until salary
              if (row !== 1) {
                td.innerHTML = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "SAR",
                  maximumFractionDigits: 0,
                }).format(value);
                td.style.fontWeight = "bold";
              } else {
                // days or day
                if (value === "Paid") td.innerHTML = value;
                else td.innerHTML = value + " day" + (value > 1 ? "s" : "");
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
