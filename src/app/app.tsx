import Navbar from "app/navbar/navbar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="min-h-full">
        {/*Update*/}
        <Navbar />
        <div className="mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
