import Navbar from "app/navbar/navbar";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PublicHomepage from "app/publicHomepage";

export default function App() {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) return <PublicHomepage />;
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
