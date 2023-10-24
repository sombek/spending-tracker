import { useNavigate, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "components/loading";
import FileSystemStorage from "app/money-tracker/storage-types/file-system-storage";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllBudgets } from "infrastructure/backend-service";
import moment from "moment";
import { FolderPlusIcon, TrashIcon } from "@heroicons/react/24/solid";

export const MonthBlock = (
  month: string,
  link: string,
  navigate: (link: string) => void,
  from?: number,
  to?: number,
) => {
  let monthImage: string;
  switch (month) {
    case "January":
      monthImage =
        "https://unsplash.com/photos/5AiWn2U10cw/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d2ludGVyfGVufDB8MHx8fDE2OTgxMzE5MTN8Mg&force=true&w=640";
      break;
    case "February":
      monthImage =
        "https://unsplash.com/photos/UdgvzNom0Xs/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzF8fHdpbnRlcnxlbnwwfDB8fHwxNjk4MTMxOTE0fDI&force=true&w=640";
      break;
    case "March":
      monthImage =
        "https://unsplash.com/photos/5eyAJMTb6mM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bWFyY2h8ZW58MHwwfHx8MTY5ODEzMTk3M3wy&force=true&w=640";
      break;
    case "April":
      monthImage =
        "https://unsplash.com/photos/uGqrMOHlkl0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YXByaWx8ZW58MHwwfHx8MTY5ODEzMTk5Nnwy&force=true&w=640";
      break;
    case "May":
      monthImage =
        "https://unsplash.com/photos/MLhzDGWnKPk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bWF5JTIwZnJ1aXR8ZW58MHwwfHx8MTY5ODEzMjA3Mnwy&force=true&w=640";
      break;
    case "June":
      monthImage =
        "https://unsplash.com/photos/SYx3UCHZJlo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c3VtbWVyfGVufDB8MHx8fDE2OTgxMzIxMDR8Mg&force=true&w=640";
      break;
    case "July":
      monthImage =
        "https://unsplash.com/photos/jcLcWL8D7AQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjN8fHN1bW1lcnxlbnwwfDB8fHwxNjk4MTMyMTA1fDI&force=true&w=640";
      break;
    case "August":
      monthImage =
        "https://unsplash.com/photos/znT5MmTjASY/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8YXVndXN0fGVufDB8MHx8fDE2OTgxMzIyMDN8Mg&force=true&w=640";
      break;
    case "September":
      monthImage =
        "https://unsplash.com/photos/lT6rAb0LhTQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c2VwdGVtYmVyfGVufDB8fHx8MTY5ODEzMTAwN3ww&force=true&w=640";
      break;
    case "October":
      monthImage =
        "https://unsplash.com/photos/jEcUvspSTZs/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8b2N0dWJyZXxlbnwwfDB8fHwxNjk4MTMyMjU0fDI&force=true&w=640";
      break;
    case "November":
      monthImage =
        "https://unsplash.com/photos/p2OQW69vXP4/download?force=true&w=640";
      break;
    case "December":
      monthImage =
        "https://unsplash.com/photos/eL5EjRxhAX8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZGVjZW1iZXIlMjAyNXxlbnwwfDB8fHwxNjk4MTMyMzM2fDI&force=true&w=640";
      break;
    default:
      monthImage =
        "https://unsplash.com/photos/lT6rAb0LhTQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c2VwdGVtYmVyfGVufDB8fHx8MTY5ODEzMTAwN3ww&force=true&w=640";
      break;
  }

  return (
    // on hover, change the border color
    <div
      className={[
        "cursor-pointer ",
        "transition duration-200 ease-in-out transform ",
        "hover:-translate-y-0.5 hover:scale-100 hover:shadow-lg hover:bg-gray-100",
        "card w-50 glass",
      ].join(" ")}
      key={month}
      onClick={() => navigate(link)}
    >
      <figure>
        <img
          src={monthImage}
          alt={month + " image"}
          // cache the image

          className={"object-cover w-full h-32 rounded-t-md"}
        />
      </figure>
      <div className="card-body relative" style={{ padding: "1rem" }}>
        {/*emoji for the month*/}
        <h2
          // square with rounded corners
          className="absolute bg-gray-200 rounded-md w-10 h-10 flex items-center justify-center text-2xl glass"
          style={{
            width: 40,
            height: 40,
            top: -30,
            left: "50%",
            marginLeft: -20,
          }}
        >
          {
            [
              "🌑",
              "⛽️",
              "🍔",
              "🍟",
              "🍕",
              "🍗",
              "🍖",
              "🥩",
              "🥓",
              "🍞",
              "🥯",
              "🥨",
              "🧀",
              "🥚",
              "🍳",
              "🥞",
              "🧇",
              "🥓",
              "🍌",
              "🍎",
              "🍏",
            ].map((emoji) => emoji)[Math.floor(Math.random() * 20)]
          }
        </h2>
        <h2 className="card-title justify-center">{month}</h2>
        {from && to && (
          <div className={"text-gray-500 text-sm font-semibold text-center"}>
            {/*From: MM/DD to MM/DD*/}
            {`From ${moment(from).format("MM/DD")} to ${moment(to).format(
              "MM/DD",
            )}`}
          </div>
        )}
      </div>
      <TrashIcon
        className={
          "w-6 h-6 absolute top-2 right-2 hover:text-red-600 opacity-30 hover:opacity-100 transition duration-200 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
        }
        onClick={() => {
          console.log("delete");
        }}
      />
    </div>
    // <div
    //   key={month}
    //   className={[
    //     "border border-gray-200 rounded-md p-4 hover:border-gray-400 cursor-pointer " +
    //       "transition duration-500 ease-in-out transform " +
    //       "hover:-translate-y-1 hover:scale-100 hover:shadow-lg hover:bg-gray-100",
    //   ].join(" ")}
    //   onClick={() => navigate(link)}
    // >
    //
    //   <div
    //     className={[
    //       "rounded-full w-16 h-16 flex items-center justify-center " +
    //         "bg-gray-200 text-gray-500",
    //     ].join(" ")}
    //   >
    //     <CalendarDaysIcon />
    //   </div>
    //   <div className={"text-center mt-4 text-gray-500 font-bold"}>
    //     {month} Salary
    //   </div>
    //   {from && to && (
    //     <div className={"text-center text-gray-500"}>
    //       {`From ${moment(from).toDate().toLocaleDateString()} to ${moment(to)
    //         .toDate()
    //         .toLocaleDateString()}`}
    //     </div>
    //   )}
    // </div>
  );
};
const Homepage = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [months, setMonths] = useState<JSX.Element[]>([]);
  useEffect(() => {
    getAccessTokenSilently().then((accessToken) => {
      getAllBudgets(accessToken)
        .then((years) => {
          const currentYear = new Date().getFullYear();
          const selectedYear = years.find((year) => year.year === currentYear);
          if (!selectedYear) throw new Error("No year found");
          const yearsMonths = selectedYear.months;
          const maxMonth = Math.max(...yearsMonths.map((month) => month.month));
          console.log(maxMonth);
          const toBeRenderedElements = yearsMonths.map((monthData) => {
            const month = monthData.month - 1;
            const monthName = new Date(0, month).toLocaleString("default", {
              month: "long",
            });
            console.log(monthData);
            const monthLink = `/money-tracker/${currentYear}/${month + 1}`;
            return MonthBlock(
              monthName,
              monthLink,
              navigate,
              monthData.fromSalary,
              monthData.toSalary,
            );
          });
          setIsLoading(false);
          // add one more month if user wants to add a new month
          const nextMonth = moment(currentYear + "-" + maxMonth);
          nextMonth.add(1, "months");
          console.log(+nextMonth.format("M"));
          toBeRenderedElements.push(
            <div
              className={[
                "cursor-pointer ",
                "transition duration-200 ease-in-out transform ",
                "hover:-translate-y-0.5 hover:scale-100 hover:shadow-lg hover:bg-gray-100",
                "card w-50 glass",
              ].join(" ")}
              key={"add-month"}
              onClick={() =>
                navigate(
                  `/money-tracker/${+nextMonth.format(
                    "YYYY",
                  )}/${+nextMonth.format("M")}`,
                )
              }
            >
              <figure>
                <img
                  src={
                    "https://unsplash.com/photos/bj3l739cwc8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YWRkfGVufDB8fHx8MTY5ODE1NTM0OHww&force=true&w=640"
                  }
                  alt={"add month image"}
                  className={"object-cover w-full h-32 rounded-t-md"}
                />
              </figure>
              <div className="" style={{ padding: "1rem" }}>
                <h2 className="card-title justify-center">
                  <FolderPlusIcon className={"w-6 h-6 mr-2 text-gray-500"} />
                  Add Month
                </h2>
              </div>
            </div>,
          );
          setMonths(toBeRenderedElements);
        })
        .catch((err) => {
          throw err;
        });
    });
  }, [getAccessTokenSilently, navigate]);
  const [selectedStorageType] = useState("cloud");
  return (
    <div
      style={{
        height: "calc(100vh - 48px)",
        background:
          "linear-gradient(to top, transparent, #f1fdf4), url(/noise.svg)",
      }}
    >
      {/*Cloud or File based storage*/}
      {/*<div className={"mx-auto mt-8 w-3/4"}>*/}
      {/*  <div className={"text-2xl font-semibold"}>*/}
      {/*    /!*Make things next to each other*!/*/}
      {/*    <div className={"text-gray-600 flex flex-col"}>*/}
      {/*      Please select the storage type*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  /!*  make them next to each other with a space between them*!/*/}
      {/*  <div className={"flex flex-row content-start space-x-4"}>*/}
      {/*    <label className="label cursor-pointer">*/}
      {/*      <input*/}
      {/*        type="radio"*/}
      {/*        name="radio-10"*/}
      {/*        className="radio checked:bg-blue-500 mr-2"*/}
      {/*        checked={selectedStorageType === "cloud"}*/}
      {/*        onChange={() => setSelectedStorageType("cloud")}*/}
      {/*      />*/}
      {/*      <CloudIcon className={"w-6 h-6"} />*/}
      {/*      <span className="label-text">Cloud Storage</span>*/}
      {/*    </label>*/}
      {/*    <label className="label cursor-pointer">*/}
      {/*      <input*/}
      {/*        type="radio"*/}
      {/*        name="radio-10"*/}
      {/*        className="radio checked:bg-red-500 mr-2"*/}
      {/*        checked={selectedStorageType === "file"}*/}
      {/*        onChange={() => setSelectedStorageType("file")}*/}
      {/*      />*/}
      {/*      <DocumentIcon className={"w-6 h-6"} />*/}
      {/*      <span className="label-text">File Storage</span>*/}
      {/*    </label>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className={"mx-auto pt-8  sm:w-3/4 w-full px-5 sm:px-0"}>
        {navigation.state === "loading" && (
          <div className={"text-2xl font-semibold"}>
            <LoadingSpinner />
          </div>
        )}
        {isLoading && (
          <div className={"text-2xl font-semibold"}>
            <LoadingSpinner />
          </div>
        )}
        {selectedStorageType === "cloud" && (
          <CloudMonths currentYear={new Date().getFullYear()} months={months} />
        )}
        {selectedStorageType === "file" && <FileSystemStorage />}
      </div>
    </div>
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

      <div className={"grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}>
        {months.map((month) => month)}
      </div>
      <br />
      <br />
    </>
  );
}

export default Homepage;
