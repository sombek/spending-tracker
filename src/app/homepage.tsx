import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import LoadingSpinner from "components/loading";

const Homepage = () => {
  // create blocks for each month
  // from January to current month
  // each block should have a link to the money tracker
  // tailwind css grid
  // heroicons for the icons
  const navigate = useNavigate();
  const MonthBlock = (
    month: string,
    year: string,
    currentMonth: boolean,
    link: string,
  ) => {
    return (
      // on hover, change the border color
      <div
        key={month}
        className={[
          "border border-gray-200 rounded-md p-4 hover:border-gray-400 cursor-pointer " +
            "transition duration-500 ease-in-out transform " +
            "hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:bg-gray-100",
        ].join(" ")}
        onClick={() => navigate(link)}
      >
        {currentMonth && (
          <div
            className={[
              "rounded-full w-16 h-16 flex items-center justify-center " +
                "bg-gray-200 text-gray-500",
            ].join(" ")}
          >
            <CalendarDaysIcon />
          </div>
        )}
        {!currentMonth && (
          <div
            className={[
              "rounded-full w-16 h-16 flex items-center justify-center " +
                "bg-gray-200 text-gray-500",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                // eslint-disable-next-line max-len
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div className={"text-center mt-4 text-gray-500"}>{month}</div>
      </div>
    );
  };
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const months = [...Array(currentMonth + 1).keys()].map((month) => {
    const monthName = new Date(0, month).toLocaleString("default", {
      month: "long",
    });
    const isCurrentMonth = month === currentMonth;
    const monthLink = `/money-tracker/${currentYear}/${month + 1}`;
    return MonthBlock(
      monthName,
      currentYear.toString(),
      isCurrentMonth,
      monthLink,
    );
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className={"mx-auto mt-8 w-3/4"}>
        <div className={"flex flex-row justify-between"}>
          <div className={"text-2xl font-semibold"}>
            Money Tracker
            <div className={"text-gray-400"}>{currentYear}</div>
          </div>
        </div>
        <div className={"grid grid-cols-3 gap-4"}>{months}</div>
      </div>
    </Suspense>
  );
};
export default Homepage;
