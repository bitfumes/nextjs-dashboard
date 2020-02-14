import React from "react";
import { Auth } from "../middlewares/auth";
import Layout from "../components/layouts/index";
function Index() {
  return <Layout>Hello</Layout>;
}

export default Auth(Index);
