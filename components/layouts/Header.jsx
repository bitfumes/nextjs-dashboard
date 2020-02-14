import Link from "next/link";
import React from "react";
import AppContext from "../../store";
import Logout from "./Logout";

function Header() {
  const [{ user, loggedIn }] = React.useContext(AppContext);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-indigo-800 p-5 shadow-lg">
      <div className="flex items-center flex-shrink-0 text-gray-700 mr-6">
        <Link href="/">
          <a className="font-semibold text-xl tracking-tight text-white">
            Dashboard
          </a>
        </Link>
      </div>
      {loggedIn ? (
        <div className="flex text-sm">
          <p className="text-white  mr-2">{user.name} |</p>
          <Logout />
        </div>
      ) : null}
    </nav>
  );
}

export default Header;
