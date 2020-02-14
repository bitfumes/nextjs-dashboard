import nextCookie from "next-cookies";
import jwt from "jsonwebtoken";
import axios from "axios";
import setAxios from "../plugins/axios";
import moment from "moment";
import cookie from "js-cookie";

export const setCookie = ({ access_token, user }) => {
  cookie.set("token", access_token, { expires: 1 });
  jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
    cookie.set("ud", token, { expires: 1 });
  });
};

export const resetUser = ({ user }) => {
  jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
    cookie.set("ud", token, { expires: 1 });
  });
};

const setUser = async ctx => {
  const { token } = nextCookie(ctx);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err || payload.exp < moment().unix()) {
        ctx.res.clearCookie("token");
        // console.error(payload.exp < moment().unix());
        console.error("JWT Not verified");
        ctx.res.redirect("/");
      }
    });
  }

  if (token && ctx.req) {
    setAxios(token);
    return getUser(ctx);
  }
  return { user: {}, loggedIn: false };
};

export const getUser = async ctx => {
  const { data } = await axios.get("/admin/me").catch(e => {
    ctx.res.clearCookie("token");
    // console.error(payload.exp < moment().unix());
    console.error("JWT Not verified");
    ctx.res.redirect("/login");
  });
  return { user: data, loggedIn: true };
};

export default setUser;
