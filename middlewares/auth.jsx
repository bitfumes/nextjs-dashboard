import { Component } from "react";
import nextCookie from "next-cookies";
import jwt from "jsonwebtoken";
import Router from "next/router";
import cookie from "js-cookie";
import moment from "moment";

const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";
export const Auth = WrappedComponent =>
  class extends Component {
    static displayName = `auth(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const { token, ud } = nextCookie(ctx);

      if (token && ud) {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err || payload.exp < moment().unix()) {
            if (ctx.res) {
              ctx.res.clearCookie("token");
              console.error("JWT Not verified");
              ctx.res.writeHead(302, { Location: "/login" });
              ``;
              ctx.res.end();
            } else {
              cookie.remove("token");
              cookie.remove("ud");
              Router.push("/login");
            }
          }
        });
      } else {
        // if (ctx.res) {
        //   ctx.res.writeHead(302, { Location: "/login" });
        //   ctx.res.end();
        // } else {
        //   Router.push("/login");
        // }
      }
      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
