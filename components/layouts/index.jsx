import React from "react";
import Router from "next/router";
import NProgress from "nprogress";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Content from "./Content";

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

const Layout = React.memo(({ children }) => {
  return (
    <>
      <Header />
      <div className="flex bg-gray-200">
        <div className="w-full flex">
          <Sidebar />
          <Content>{children}</Content>
        </div>
      </div>
    </>
  );
});

export default Layout;
