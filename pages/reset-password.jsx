import React from "react";
import Header from "../components/layouts/Header";
import ErrorField from "../components/Error";
import { useRouter } from "next/router";
import { Submit } from "../components/buttons";
import Axios from "axios";
import flash from "../plugins/flash";
import Link from "next/link";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const initialState = {
    email: "",
    password: "",
    password_confirmation: "",
    errors: {},
    token: router.query.token
  };
  const [state, setState] = React.useState(initialState);

  const handleChange = ({ target }) => {
    setState({ ...state, [target.name]: target.value });
  };

  function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    Axios.post("admin/password/reset", state)
      .then(res => {
        flash("success", "Your Password is changed, now login.", 10);
        router.push("/login");
        setIsLoading(false);
      })
      .catch(e => {
        const errors = e.response.data.errors
          ? e.response.data.errors
          : e.response.data;
        setState({ ...state, errors: errors });
        flash("error", "There is some problem");
        setIsLoading(false);
      });
  }

  return (
    <>
      <Header />
      <div className="w-full mt-20 mb-10 flex justify-center p-4">
        <form
          className="bg-white shadow-md border rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/3"
          onSubmit={submit}
        >
          <h1 className="text-2xl text-center mb-4 pb-2 border-b border-grey-300">
            Reset Your Password
          </h1>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2 py-4"
              htmlFor="email"
            >
              Enter your Email
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
              className="block text-gray-700 text-sm mb-2 py-4"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
            <ErrorField errors={state.errors} name="password" />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2 py-4"
              htmlFor="password_confirmation"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password_confirmation"
              name="password_confirmation"
              type="password_confirmation"
              placeholder="password_confirmation"
              value={state.password_confirmation}
              onChange={handleChange}
            />
            <ErrorField errors={state.errors} name="password_confirmation" />
          </div>

          <div className="flex items-center justify-between w-full">
            <Submit isLoading={isLoading} title="Reset" />
          </div>
          <div className="my-10 flex text-center">
            <Link href="/login">
              <a className="text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full bg-gray-600">
                Back to Login
              </a>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
