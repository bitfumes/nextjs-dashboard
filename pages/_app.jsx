import React from "react";
import App from "next/app";
import setAxios from "../plugins/axios";
import setUser, { resetUser } from "../utilities/user";
import nextCookie from "next-cookies";
import AppContext, { reducer, globalState } from "../store";
import "../assets/tailwind.css";
import "../assets/nprogress.css";

class MyApp extends App {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const user = await setUser(appContext.ctx);
    const { token } = nextCookie(appContext.ctx);
    return { ...appProps, user, token };
  }

  render() {
    const { Component, pageProps, user, token } = this.props;
    setAxios(token);
    return (
      <WithStore user={user}>
        <Component {...pageProps} />
      </WithStore>
    );
  }
}

function WithStore({ user, children }) {
  React.useEffect(() => {
    resetUser(user);
  }, []);

  const [state, dispatch] = React.useReducer(reducer, {
    ...globalState,
    ...user
  });

  function can(user) {
    const authUser = state.user;
    if (authUser) {
      return authUser.id === user.id;
    }
  }

  function permitTo() {
    if (!state.loggedIn) return false;
    const assignedPermissions = [...arguments];
    return !!state.user.permissions.find(perms =>
      assignedPermissions.includes(perms.name)
    );
  }

  function permitToParent() {
    if (!state.loggedIn) return false;
    const assignedPermissions = [...arguments];
    return !!state.user.permissions.find(perm =>
      assignedPermissions.includes(perm.parent)
    );
  }

  function hasRoleOf(roleName) {
    if (!state.loggedIn) return false;
    return !!state.user.roles.find(role => role.name == roleName);
  }

  function getImage(image) {
    return `${process.env.IMAGE_CDN}/${image}`;
  }

  return (
    <AppContext.Provider
      value={[
        state,
        dispatch,
        { can, getImage, permitTo, permitToParent, hasRoleOf }
      ]}
    >
      {children}
    </AppContext.Provider>
  );
}

export default MyApp;
