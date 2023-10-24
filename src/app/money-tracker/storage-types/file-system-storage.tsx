import { useState } from "react";
import { MonthBlock } from "app/homepage";
import { useNavigate } from "react-router-dom";
import { FolderOpenIcon } from "@heroicons/react/24/solid";

function FileSystemStorage() {
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null); // DirectoryHandle
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const months = [8, 9]
    .map((n) => n - 1)
    .map((month) => {
      const monthName = new Date(0, month).toLocaleString("default", {
        month: "long",
      });
      const monthLink = `/money-tracker/${currentYear}/${month + 1}`;
      return MonthBlock(monthName, monthLink, navigate);
    });

  async function selectDirectory() {
    const dirOptions: DirectoryPickerOptions = {
      mode: "readwrite",
      startIn: "documents",
    };
    const dirHandle = await window.showDirectoryPicker(dirOptions);
    // make sure every month has a file
    // if not create it
    // if it does, read it
    for (const month of months) {
      await dirHandle.getFileHandle(`${month.key}.json`, {
        create: true,
      });
    }
    setDirectoryHandle(dirHandle);
  }

  return (
    <>
      <button className="btn btn-neutral" onClick={selectDirectory}>
        <FolderOpenIcon className="h-5 w-5 mr-2" />
        Select Directory Please
      </button>
      {/*print directory path and details*/}

      {directoryHandle && (
        <div>
          <div className="text-left mt-4 text-gray-900">
            <p>
              Directory Name:
              <span className={"kbd kbd-sm cursor-default"}>
                {directoryHandle.name}
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
                    const fileHandle = await directoryHandle.getFileHandle(
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
