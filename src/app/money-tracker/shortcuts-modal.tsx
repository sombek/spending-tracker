import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const shortcuts = [
  {
    action: "Toggle Shortcuts Modal",
    keys: ["⌘", "/"],
  },
  {
    action: "Add row above",
    keys: ["Option", "↑"],
    note: "Only works when there is a row selected",
  },
  {
    action: "Add row below",
    keys: ["Option", "↓"],
    note: "Only works when there is a row selected",
  },
  {
    action: "Delete row",
    keys: ["⌘", "Option", "Delete or Backspace"],
  },
];

const ShortcutList = () => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {shortcuts.map((person) => (
        <li key={person.action} className="flex justify-between gap-x-6 py-2">
          <div className="flex min-w-0 gap-x-4">
            {/* Make the action and same line as the keys */}
            <div className="flex justify-center">
              <p className="text-sm font-bold text-gray-900">
                {person.action}:{" "}
              </p>
              <kbd className="bg-gray-100 rounded-md px-2 py-1 text-xs font-semibold text-gray-900 ml-5">
                {person.keys.map((key, index) => (
                  <Fragment key={key}>
                    <span
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                      key={key}
                    >
                      {key}
                    </span>
                    {index !== person.keys.length - 1 && " + "}
                  </Fragment>
                ))}
              </kbd>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default function ShortcutsModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative"
        style={{ zIndex: 160 }}
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div
          className="fixed inset-0 w-screen overflow-y-auto"
          style={{ zIndex: 160 }}
        >
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h1"
                        className="text-lg leading-6 font-bold text-gray-900"
                      >
                        Shortcuts Legend
                      </Dialog.Title>
                      <div className="mt-2">
                        <ShortcutList />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
