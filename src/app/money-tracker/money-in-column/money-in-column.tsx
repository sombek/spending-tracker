import styles from "./money-in-column.module.css";
import { PurchaseViewModel } from "app/money-tracker/money-out-column/category-view-model";
import { HotColumn, HotTable } from "@handsontable/react";
import { useMemo } from "react";

const MoneyInColumn = (props: {
  moneyIn: PurchaseViewModel[];
  setMoneyIn: (data: PurchaseViewModel[]) => void;
}) => {
  const totalMoneyIn = useMemo(() => {
    return props.moneyIn.reduce((sum, payment) => {
      if (payment.amount === null || payment.amount === undefined) return sum;

      return sum + +payment.amount;
    }, 0);
  }, [props.moneyIn]);

  return (
    <div>
      <div className={styles.moneyInColumnContent}>
        <div className={styles.moneyInHeader}>
          <div className={styles.moneyIn}>💰Money In</div>
        </div>
        <div
          className={"p-2 bg-white"}
          style={{
            height: "calc(100vh - (50px + 64px + 50px + 1px))",
            borderRight: "1px solid #e2e8f0",
          }}
        >
          <div className={"mt-2"}>
            <HotTable
              colHeaders={true}
              rowHeaders={false}
              data={props.moneyIn}
              // default row count when the table is initialized
              minRows={1}
              // take the proper width of the parent element
              width="100%"
              // take the proper height of the parent element
              height="auto"
              autoColumnSize={true}
              contextMenu={true}
              afterChange={(changes) => {
                if (changes === null) return;
                // data is being updated by the hot table
                // just need to create a copy of the data and update the state
                const copyOfData: PurchaseViewModel[] = [];
                Object.assign(copyOfData, props.moneyIn);
                props.setMoneyIn(copyOfData);
              }}
              stretchH={"all"}
              colWidths={"100%"}
              licenseKey="non-commercial-and-evaluation"
            >
              <HotColumn title={"Name"} data={"title"} />
              <HotColumn
                title={"Amount"}
                data={"amount"}
                renderer={(instance, td, row, col, prop, value) => {
                  const formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "SAR",
                  });
                  td.innerHTML = formatter.format(value);
                  return td;
                }}
              />
            </HotTable>
          </div>
        </div>

        {/*  At bottom show sum*/}
        <div className={styles.sum}>
          <div className={styles.sumText}>Total</div>
          <div className={styles.sumAmount}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "SAR",
            }).format(totalMoneyIn)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoneyInColumn;
