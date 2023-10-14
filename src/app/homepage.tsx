import {
  CalendarDaysIcon,
  IdentificationIcon,
} from "@heroicons/react/20/solid";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import LoadingSpinner from "components/loading";
import { useAuth0 } from "@auth0/auth0-react";
import { CloudIcon, DocumentIcon } from "@heroicons/react/24/solid";
import FileSystemStorage from "app/money-tracker/storage-types/file-system-storage";

export const MonthBlock = (
  month: string,
  currentMonth: boolean,
  link: string,
  navigate: NavigateFunction,
) => {
  return (
    // on hover, change the border color
    <div
      key={month}
      className={[
        "border border-gray-200 rounded-md p-4 hover:border-gray-400 cursor-pointer " +
          "transition duration-500 ease-in-out transform " +
          "hover:-translate-y-1 hover:scale-100 hover:shadow-lg hover:bg-gray-100",
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
      <div className={"text-center mt-4 text-gray-500"}>{month} Salary</div>
    </div>
  );
};
const Homepage = () => {
  // create blocks for each month
  // from January to current month
  // each block should have a link to the money tracker
  // tailwind css grid
  // heroicons for the icons
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const months = [8, 9]
    .map((n) => n - 1)
    .map((month) => {
      const monthName = new Date(0, month).toLocaleString("default", {
        month: "long",
      });
      const isCurrentMonth = month === currentMonth;
      const monthLink = `/money-tracker/${currentYear}/${month + 1}`;
      return MonthBlock(monthName, isCurrentMonth, monthLink, navigate);
    });

  const [selectedStorageType, setSelectedStorageType] = useState("cloud");
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated)
    return (
      <div className={"mx-auto mt-8 w-3/4"}>
        {/*put a message here to say that the user needs to log in*/}

        <div className={"text-2xl font-semibold"}>
          {/*Make things next to each other*/}
          <div className={"text-gray-400 flex flex-col"}>
            <IdentificationIcon
              style={{
                width: "100px",
                height: "100px",
                color: "#374151",
              }}
            />
            <div className={"text-2xl font-semibold"}>
              Please log in to continue
            </div>
          </div>
        </div>
        {/*  Put some text here to explain what the app is about*/}
        <p>
          This is a simple app to help you track your money. You can use it to
          track your income and expenses. You can also use it to track your
          savings and investments.
        </p>
      </div>
    );
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/*Cloud or File based storage*/}
      <div className={"mx-auto mt-8 w-3/4"}>
        {/* Ask the user to select the storage type*/}
        {/* If the user selects cloud storage show list of months and years*/}
        {/* If the user selects file storage show list of files*/}
        {/* If the user selects file storage and there are no files, show a message*/}
        {/* If the user selects file storage and there are files, show list of files*/}
        <div className={"text-2xl font-semibold"}>
          {/*Make things next to each other*/}
          <div className={"text-gray-600 flex flex-col"}>
            Please select the storage type
          </div>
        </div>
        {/*  make them next to each other with a space between them*/}
        <div className={"flex flex-row content-start space-x-4"}>
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-blue-500 mr-2"
              checked={selectedStorageType === "cloud"}
              onChange={() => setSelectedStorageType("cloud")}
            />
            <CloudIcon className={"w-6 h-6"} />
            <span className="label-text">Cloud Storage</span>
          </label>
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-red-500 mr-2"
              checked={selectedStorageType === "file"}
              onChange={() => setSelectedStorageType("file")}
            />
            <DocumentIcon className={"w-6 h-6"} />
            <span className="label-text">File Storage</span>
          </label>
        </div>
      </div>
      <div className={"mx-auto mt-8 w-3/4"}>
        {selectedStorageType === "cloud" && (
          <CloudMonths currentYear={currentYear} months={months} />
        )}
        {selectedStorageType === "file" && <FileSystemStorage />}
      </div>
    </Suspense>
  );
};

function CloudMonths({
  currentYear,
  months,
}: {
  currentYear: number;
  months: JSX.Element[];
}) {
  return (
    <>
      <div className={"flex flex-row justify-between"}>
        <div className={"text-2xl font-semibold"}>
          Money Tracker
          <div className={"text-gray-400"}>{currentYear}</div>
        </div>
      </div>
      <hr />
      <br />

      <div className={"grid grid-cols-3 gap-4"}>
        {months.map((month) => month)}
      </div>
    </>
  );
}

export default Homepage;
