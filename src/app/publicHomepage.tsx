import { useAuth0 } from "@auth0/auth0-react";
import LoadingSpinner from "components/loading";
import { useEffect, useState } from "react";

const PublicHomepage = () => {
  const { loginWithRedirect, isLoading } = useAuth0();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  useEffect(() => setShowLoading(isLoading), [isLoading]);
  const [showAtRandomTimes] = useState<boolean>(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowAtRandomTimes(true);
  //   }, Math.random() * 10000);
  // }, []);

  function redirectToLogin() {
    loginWithRedirect().then(() => {
      setShowLoading(true);
    });
  }

  return (
    <div
      className="leading-normal tracking-normal text-indigo-400  bg-cover bg-fixed px-8"
      style={{
        backgroundImage: "url('bg.png')",
        height: "100vh",
        width: "100vw",
        overflowY: "scroll",
      }}
    >
      {showLoading && (
        <div className={"text-white"}>
          <LoadingSpinner />
        </div>
      )}
      {/* Nav */}
      <div>
        {/* Nav */}
        <div className="w-full container mx-auto">
          <div className="w-full flex items-center justify-between mt-10">
            <a
              className="flex items-center text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              href="#"
            >
              Spending Tracker
            </a>

            <div className="flex w-1/2 justify-end content-center">
              {/* Twitter x account with svg */}
              <a
                className="inline-block text-white no-underline hover:text-gray-200 hover:text-underline py-2 px-4"
                href="https://x.com/Abdullahjsx"
                target={"_blank"}
                rel="noreferrer"
              >
                <svg
                  className="fill-current h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M437.016 151.033c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.257-298.257 298.257-59.49 0-114.68-17.234-161.072-47.032 8.325.975 16.65 1.625 25.1 1.625 49.033 0 94.145-16.649 130.072-44.548-46.14-.975-84.515-31.2-97.64-72.646 6.424.975 12.85 1.625 19.275 1.625 9.097 0 18.194-1.3 26.916-3.575-47.065-9.097-82.06-50.81-82.06-100.48v-1.3c13.125 7.55 28.57 12.2 44.548 12.85-26.916-18.194-44.548-49.033-44.548-83.76 0-18.194 4.55-35.826 12.2-50.81 44.223 54.258 110.39 89.253 184.09 92.878-1.625-7.55-2.6-15.775-2.6-24.35 0-58.49 47.032-105.583 105.583-105.583 30.1 0 57.14 12.2 76.685 31.2 23.13-4.55 44.548-13.125 64.093-25.1-7.55 23.13-23.13 42.675-43.675 54.258 20.545-2.6 40.09-7.55 58.49-15.775-13.125 20.545-29.98 38.178-49.033 52.512z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          {/* Left Col */}
          <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start ">
            <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
              Start tracking your spending today
            </h1>
            <p className="leading-normal text-info md:text-2xl mb-8 text-center md:text-left">
              From your typical excel sheets tracking to a more modern way of
              tracking your spending
            </p>
            {/*https://i.pinimg.com/originals/c1/91/9b/c1919b49dd6f835cf4638cebeca3ff07.gif*/}

            <div className="flex w-full justify-center md:justify-start  lg:pb-0 fade-in relative">
              {/*Login or Register*/}

              <button className="btn btn-neutral" onClick={redirectToLogin}>
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
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Login or Register
              </button>
            </div>
            {showAtRandomTimes && (
              <img
                className="w-40 z-50 text-center"
                src="thumbs-up.gif"
                alt={"thumbs-up"}
              />
            )}
          </div>

          {/* Right Col */}
          <div className="w-full xl:w-3/5 p-12 overflow-hidden mx-auto md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6">
            <div className="mockup-window border bg-base-300 shadow-lg shadow-fuchsia-300 ">
              <img className="" src="screenshot.jpg" alt="MacBook" />
            </div>
          </div>

          {/* Footer */}
          <div className="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
            <a
              className="text-gray-500 no-underline hover:no-underline"
              href="#"
            >
              &copy; Spending Tracker {new Date().getFullYear()}
            </a>
            - Template by
            <a
              className="text-gray-500 no-underline hover:no-underline"
              href="https://www.tailwindtoolbox.com"
            >
              TailwindToolbox.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublicHomepage;
