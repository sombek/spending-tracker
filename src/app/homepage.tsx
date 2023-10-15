import {
  CalendarDaysIcon,
  IdentificationIcon,
} from "@heroicons/react/20/solid";
import {
  NavigateFunction,
  Navigation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { Suspense, useState } from "react";
import LoadingSpinner from "components/loading";
import { useAuth0 } from "@auth0/auth0-react";
import { CloudIcon, DocumentIcon } from "@heroicons/react/24/solid";
import FileSystemStorage from "app/money-tracker/storage-types/file-system-storage";

export const MonthBlock = (
  month: string,
  navigation: Navigation,
  link: string,
  navigate: NavigateFunction,
) => {
  const location = navigation.location;
  let loading = false;
  if (location) {
    const navigationState = navigation.state;
    loading = location.pathname === link && navigationState === "loading";
  }

  return (
    // on hover, change the border color
    <div
      key={month}
      className={[
        "border border-gray-200 rounded-md p-4 hover:border-gray-400 cursor-pointer " +
          "transition duration-500 ease-in-out transform " +
          "hover:-translate-y-1 hover:scale-100 hover:shadow-lg hover:bg-gray-100",
      ].join(" ")}
      onClick={(e) => {
        e.preventDefault();
        navigate(link, {
          state: {
            dataStorageType: "cloud",
          },
        });
      }}
    >
      <div
        className={[
          "rounded-full w-16 h-16 flex items-center justify-center " +
            "bg-gray-200 text-gray-500",
        ].join(" ")}
      >
        {loading && <span className="loading loading-spinner text-warning" />}
        {!loading && <CalendarDaysIcon className={"w-12 h-12"} />}
      </div>
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
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const months = [8, 9]
    .map((n) => n - 1)
    .map((month) => {
      const monthName = new Date(0, month).toLocaleString("default", {
        month: "long",
      });
      const monthLink = `/money-tracker/${currentYear}/${month + 1}/cloud`;
      return MonthBlock(monthName, navigation, monthLink, navigate);
    });

  const [selectedStorageType, setSelectedStorageType] = useState(() => {
    const selectedStorageType = window.localStorage.getItem(
      "selectedStorageType",
    );
    if (selectedStorageType) return selectedStorageType;
    return "cloud";
  });
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
      <div className={"mx-auto mt-8 w-3/4"}>
        <div className={"text-2xl font-semibold"}>
          <div className={"text-gray-600 flex flex-col"}>
            Please select the storage type
          </div>
        </div>

        <div className={"flex flex-row content-start space-x-4"}>
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-blue-500 mr-2"
              checked={selectedStorageType === "cloud"}
              onChange={() => {
                setSelectedStorageType("cloud");
                // store the selected storage type in local storage
                // so that the next time the user comes back
                window.localStorage.setItem("selectedStorageType", "cloud");
              }}
            />
            <CloudIcon className={"w-6 h-6"} />
            <span className="label-text">Cloud Storage</span>
          </label>
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-10"
              className="radio checked:bg-blue-500 mr-2"
              checked={selectedStorageType === "file"}
              onChange={() => {
                setSelectedStorageType("file");
                // store the selected storage type in local storage
                // so that the next time the user comes back
                window.localStorage.setItem("selectedStorageType", "file");
              }}
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
