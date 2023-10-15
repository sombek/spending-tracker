import Navbar from "app/navbar/navbar";
import { Outlet } from "react-router-dom";
import { createContext, RefObject, useState } from "react";

export const FileSystemStorageContext = createContext<{
  directoryHandle: RefObject<FileSystemDirectoryHandle | null>;
  setDirectoryHandle: (directoryHandle: FileSystemDirectoryHandle) => void;
}>({
  directoryHandle: { current: null },
  setDirectoryHandle: () => {},
});
export default function App() {
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null); // DirectoryHandle

  return (
    <>
      <div className="min-h-full">
        <Navbar />

        <div className="mx-auto">
          <FileSystemStorageContext.Provider
            value={{
              directoryHandle: { current: directoryHandle },
              setDirectoryHandle: setDirectoryHandle,
            }}
          >
            <Outlet />
          </FileSystemStorageContext.Provider>
        </div>
      </div>
    </>
  );
}
