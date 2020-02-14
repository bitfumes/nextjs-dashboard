import axios from "axios";
import React from "react";
import { useRouter } from "next/router";
import flash from "../plugins/flash";
import ErrorField from "../components/Error";
import { setCookie } from "../utilities/user";
import Header from "../components/layouts/Header";
import AppContext from "../store";
import { Guest } from "../middlewares/guest";
import { Submit } from "../components/buttons";
import Link from "next/link";

function Login(props) {
  const [, dispatch] = React.useContext(AppContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const [state, setState] = React.useState({
    email: "",
    password: "",
    errors: {}
  });

  const router = useRouter();

  const handleChange = ({ target }) => {
    setState({ ...state, [target.name]: target.value });
  };

  const handleLogin = data => {
    setCookie(data);
    flash("success", "You are logged In");
    dispatch({ type: "SET_LOGIN", payload: data.user });
    window.location = "/";
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      axios
        .post(`/admin/login`, state)
        .then(res => handleLogin(res.data))
        .catch(e => {
          setIsLoading(false);
          const err = e.response.data.errors
            ? e.response.data.errors
            : { error: e.response.data.error };
          setState({ ...state, errors: err });
        });
    }
  };

  return (
    <>
      <Header />
      <div className="w-full mt-20 mb-10 flex justify-center">
        <form
          className="bg-white shadow-md border rounded px-8 pt-6 pb-8 mb-4 w-1/3"
          onSubmit={onSubmit}
        >
          <h1 className="text-2xl text-center mb-4 pb-2 border-b border-grey-300">
            Login Here
          </h1>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={state.email}
              onChange={handleChange}
            />
            <ErrorField errors={state.errors} name="email" />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="*********"
              value={state.password}
              onChange={handleChange}
            />
            <ErrorField errors={state.errors} name="password" />
          </div>

          <Link href="/forgot-password">
            <a className="float-right text-gray-500 text-sm cursor-pointer py-2">
              Forgot Password
            </a>
          </Link>

          <div className="flex items-center w-full justify-between">
            <Submit isLoading={isLoading} />
          </div>
        </form>
      </div>
    </>
  );
}

export default Guest(Login);
