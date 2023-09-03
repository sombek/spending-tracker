import { PlusIcon } from "@heroicons/react/20/solid";
import { ComponentProps, forwardRef } from "react";
import styles from "./money-in-column.module.css";

const MoneyInColumn = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<"div">, "className">
>((props, ref) => (
  <div ref={ref} {...props}>
    <div className={styles.moneyInColumnContent}>
      <div className={styles.moneyInHeader}>
        <div className={styles.moneyIn}>💰Money In</div>
        <button className="bg-gray-300 hover:bg-gray-400 py-1.5 px-1.5 rounded inline-flex items-center border shadow">
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/*  listing*/}
      <div className={styles.listing}>
        <div className={styles.listingItem}>
          <div className={"text-xs font-extrabold"} style={{ color: "grey" }}>
            Fri, 10 Sep
          </div>

          <div className={"flex flex-row justify-between"}>
            <div className={"col-auto"}>
              <div className={"text-xs"}>Salary</div>
            </div>
            <div className={"col-auto"}>
              <div className={"text-xs"}>£ 1,000.00</div>
            </div>
          </div>
        </div>
        <div className={styles.listingItem}>
          <div className={"text-xs font-extrabold"} style={{ color: "grey" }}>
            Fri, 10 Sep
          </div>

          <div className={"flex flex-row justify-between"}>
            <div className={"col-auto"}>
              <div className={"text-xs"}>Salary</div>
            </div>
            <div className={"col-auto"}>
              <div className={"text-xs"}>£ 1,000.00</div>
            </div>
          </div>
        </div>
        <div className={styles.listingItem}>
          <div className={"text-xs font-extrabold"} style={{ color: "grey" }}>
            Fri, 10 Sep
          </div>

          <div className={"flex flex-row justify-between"}>
            <div className={"col-auto"}>
              <div className={"text-xs"}>Salary</div>
            </div>
            <div className={"col-auto"}>
              <div className={"text-xs"}>£ 1,000.00</div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}

      {/*  At bottom show sum*/}
      <div className={styles.sum}>
        <div className={styles.sumText}>Total</div>
        <div className={styles.sumAmount}>£ 1,000.00</div>
      </div>
    </div>
  </div>
));
export default MoneyInColumn;
