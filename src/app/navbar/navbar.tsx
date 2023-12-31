import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import LoadingSpinner from "components/loading";

function ProfileDropdown() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } =
    useAuth0();
  if (isLoading)
    return (
      <div className={"text-white"}>
        <LoadingSpinner />
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="ml-3 relative p-3">
        <div>
          <button
            className="flex items-center text-sm  text-white focus:outline-none focus:shadow-solid"
            id="user-menu"
            aria-label="User menu"
            aria-haspopup="true"
            onClick={() => loginWithRedirect()}
          >
            {/*use heroicons for the login icon*/}
            <div className="flex items-center">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-white mr-2" />
              <p>Log in</p>
            </div>
          </button>
        </div>
      </div>
    );

  if (!user)
    throw new Error(
      "User is not defined, this should not happen, please contact the developer",
    );
  return (
    <div className="ml-3 relative p-3">
      <div>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center text-sm  text-white focus:outline-none focus:shadow-solid">
                <img
                  className="h-8 w-8 rounded-full object-cover border-2 border-white mr-2"
                  referrerPolicy={"no-referrer"}
                  src={user.picture}
                  alt=""
                />
                <p className="text-white">{user.name}</p>
                {open ? (
                  <XMarkIcon className="ml-2 -mr-0.5 h-4 w-4" />
                ) : (
                  <Bars3Icon className="ml-2 -mr-0.5 h-4 w-4" />
                )}
              </Disclosure.Button>
              <Disclosure.Panel className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left cursor-pointer"
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin,
                        },
                      })
                    }
                  >
                    <div className="flex items-center">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p>Log Out</p>
                    </div>
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

const Navbar = () => {
  const navigation = [{ name: "Home", href: "/", current: false }];
  const { pathname } = useLocation();
  navigation.forEach((item) => {
    item.current = pathname === item.href;
  });

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="pl-10 ">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>

            <div className="block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium",
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/*on the right side of the navbar*/}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};
export default Navbar;
