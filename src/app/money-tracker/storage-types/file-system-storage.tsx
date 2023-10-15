import { useContext, useEffect } from "react";
import { MonthBlock } from "app/homepage";
import { useNavigate, useNavigation } from "react-router-dom";
import { FolderOpenIcon } from "@heroicons/react/24/solid";
import { FileSystemStorageContext } from "app/app";
import { get, set } from "idb-keyval";

export async function selectDirectory(
  setDirectoryHandle: (directoryHandle: FileSystemDirectoryHandle) => void,
) {
  const currentYear = new Date().getFullYear();
  const months = [8, 9];

  const dirOptions: DirectoryPickerOptions = {
    mode: "readwrite",
    startIn: "documents",
  };
  try {
    const fileHandleOrUndefined = await get("directory");
    if (fileHandleOrUndefined) {
      console.log(
        `Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`,
      );
      setDirectoryHandle(fileHandleOrUndefined);
    }
    // This always returns an array, but we just need the first entry.
    const dirHandle = await window.showDirectoryPicker(dirOptions);
    for (const month of months)
      await dirHandle.getFileHandle(`${currentYear}-${month}.json`, {
        create: true,
      });

    setDirectoryHandle(dirHandle);
    await set("directory", dirHandle);
    console.log(`Saved file handle "${dirHandle.name}" to IndexedDB.`);
  } catch (error) {
    console.error(error);
  }
}

function FileSystemStorage() {
  const fsStorageContext = useContext(FileSystemStorageContext);

  const navigate = useNavigate();
  const navigation = useNavigation();

  const currentYear = new Date().getFullYear();
  const months = [8, 9]
    .map((n) => n - 1)
    .map((month) => {
      const monthName = new Date(0, month).toLocaleString("default", {
        month: "long",
      });
      const monthLink = `/money-tracker/${currentYear}/${month + 1}/local`;
      return MonthBlock(monthName, navigation, monthLink, navigate);
    });
  useEffect(() => {
    async function getDirectory() {
      const fileHandleOrUndefined = await get("directory");
      if (fileHandleOrUndefined) {
        console.log(
          `Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`,
        );
        fsStorageContext.setDirectoryHandle(fileHandleOrUndefined);
      }
    }

    getDirectory().then(() => {
      console.log("got directory");
    });
  }, []);
  return (
    <>
      {fsStorageContext.directoryHandle.current === null && (
        <button
          className="btn btn-neutral"
          onClick={() => selectDirectory(fsStorageContext.setDirectoryHandle)}
        >
          <FolderOpenIcon className="h-5 w-5 mr-2" />
          Select Directory Please
        </button>
      )}
      {fsStorageContext.directoryHandle.current !== null && (
        <button
          className="btn btn-neutral"
          onClick={() => selectDirectory(fsStorageContext.setDirectoryHandle)}
        >
          <FolderOpenIcon className="h-5 w-5 mr-2" />
          Change Directory
        </button>
      )}
      {/*print directory path and details*/}

      {fsStorageContext.directoryHandle.current && (
        <div>
          <div className="text-left mt-4 text-gray-900">
            <p>
              Directory Name:
              <span className={"kbd kbd-sm cursor-default"}>
                {fsStorageContext.directoryHandle.current.name}
              </span>
            </p>
            <p>
              Access Mode:
              <span className={"kbd kbd-sm cursor-default"}>Read / Write</span>
            </p>
          </div>
          <br />
          <div className="grid grid-cols-2 gap-4">
            {months.map((month) => (
              <div key={month.key} className="text-center">
                {month}
                <button
                  className="btn"
                  onClick={async () => {
                    //   write dummy data to the file for the current month
                    const current = fsStorageContext.directoryHandle.current;
                    if (!current) return;
                    const fileHandle = await current.getFileHandle(
                      `${month.key}.json`,
                      {
                        create: true,
                      },
                    );
                    const writable = await fileHandle.createWritable();
                    await writable.write(
                      JSON.stringify(
                        {
                          month: month.key,
                          year: currentYear,
                          data: new Date().toISOString(),
                        },
                        null,
                        2,
                      ),
                    );
                    await writable.close();
                  }}
                >
                  test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default FileSystemStorage;
