import React from "react";
import Router from "next/router";
import cookie from "js-cookie";
import AppContext from "../../store";

function Logout() {
  const [, dispatch] = React.useContext(AppContext);
  function logout(e) {
    e.preventDefault();
    cookie.remove("token");
    cookie.remove("ud");
    dispatch({ type: "SET_LOGOUT" });
    Router.push("/login");
  }

  return (
    <div className="flex cursor-pointer">
      <a onClick={logout} className="text-white">
        <span className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}

export default Logout;
