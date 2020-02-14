import React from "react";
import Header from "../components/layouts/Header";
import ErrorField from "../components/Error";
import { Submit } from "../components/buttons";
import Link from "next/link";
import Axios from "axios";
import flash from "../plugins/flash";

export default function ForgotPassword() {
  const [email, setemail] = React.useState("");
  const [errors, seterrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  function handleChange(e) {
    setemail(e.target.value);
  }

  function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    Axios.post("admin/password/email", { email })
      .then(res => {
        flash("success", "Check your inbox to get password reset link", 5);
        setemail("");
        setIsLoading(false);
      })
      .catch(e => {
        seterrors(e.response.data.errors);
        flash("error", "Problem sending email");
        setIsLoading(true);
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
            Forgot Password
          </h1>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2 py-4"
              htmlFor="email"
            >
              Enter your Email to get password reset link
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
            <ErrorField errors={errors} name="email" />
          </div>

          <div className="flex items-center justify-between w-full">
            <Submit isLoading={isLoading} title="Request Reset Email" />
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
