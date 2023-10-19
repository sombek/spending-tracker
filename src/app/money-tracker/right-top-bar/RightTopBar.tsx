import { useEffect, useState } from "react";

const RightTopBar = (props: {
  nextSalaryDate: Date;
  sumOfMoneyIn: number;
  sumOfMoneyOut: number;
  sumOfMoneyRemaining: number;
}) => {
  const [daysUntilSalary, setDaysUntilSalary] = useState<number>(() => {
    if (props.nextSalaryDate < new Date()) return 0;

    const numberOfDaysUntilSalary = Math.ceil(
      (props.nextSalaryDate.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    console.log("numberOfDaysUntilSalary", numberOfDaysUntilSalary);
    if (numberOfDaysUntilSalary === -0) return 0;

    return numberOfDaysUntilSalary;
  });

  useEffect(() => {
    if (props.nextSalaryDate < new Date()) {
      setDaysUntilSalary(0);
      return;
    }

    const numberOfDaysUntilSalary = Math.ceil(
      (props.nextSalaryDate.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (numberOfDaysUntilSalary === -0) {
      setDaysUntilSalary(0);
      return;
    }
    const interval = setInterval(() => {
      setDaysUntilSalary((daysUntilSalary) => {
        if (daysUntilSalary === numberOfDaysUntilSalary) {
          clearInterval(interval);
          return daysUntilSalary;
        }
        return daysUntilSalary + 1;
      });
    }, 1);
  }, [props.nextSalaryDate]);

  return (
    <div
      className="flex flex-row justify-start items-center w-full h-full gap-4"
      style={{ paddingLeft: 20, paddingRight: 20, width: "fit-content" }}
    >
      <div className="stats">
        <div className="stat" data-tour="1.1-step">
          <div className="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-title">Money In</div>
          <div className="stat-value">
            {" "}
            <div className="stat-value text-success-content">
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
              }).format(props.sumOfMoneyIn)}
              {/*  show currency small*/}
              <span className="text-xs text-gray-400"> SAR</span>
            </div>
          </div>
          <div className="stat-desc">Sum of all income</div>
        </div>

        <div className="stat" data-tour="2.1-step">
          <div className="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
          <div className="stat-title">Money Out</div>
          <div className="stat-value">
            <div className="stat-value text-error-content">
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
              }).format(props.sumOfMoneyOut)}
              {/*  show currency small*/}
              <span className="text-xs text-gray-400"> SAR</span>
            </div>
          </div>
          <div className="stat-desc">Sum of all expenses</div>
        </div>

        <div className="stat" data-tour="4.1-step">
          <div className="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>
          </div>
          <div className="stat-title">Money Remaining</div>
          <div className="stat-value text-success-content">
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 0,
            }).format(props.sumOfMoneyRemaining)}
            {/*  show currency small*/}
            <span className="text-xs text-gray-400"> SAR</span>
          </div>
          <div className="stat-desc">What's left over until now</div>
        </div>
      </div>
      {/*hide on small screen*/}

      <div className="stats">
        <div className="stat">
          <div className="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </div>
          <div className="stat-title">Next salary in</div>
          <div className="stat-value">
            <span className="countdown font-mono">
              <span
                style={
                  // @ts-ignore
                  { "--value": daysUntilSalary }
                }
              ></span>
            </span>
            <span className="text-xs text-gray-400">Days</span>
          </div>
          <div className="stat-desc">
            {/*Day and month only*/}
            Until{" "}
            {props.nextSalaryDate?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightTopBar;
