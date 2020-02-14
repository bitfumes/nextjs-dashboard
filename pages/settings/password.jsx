import React from "react";
import Layout from "../../components/layouts/index";
import ErrorField from "../../components/Error";
import Axios from "axios";
import flash from "../../plugins/flash";
import { Submit } from "../../components/buttons";
import { Auth } from "../../middlewares/auth";

function Password() {
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const initialForm = {
    oldPassword: "",
    password: "",
    password_confirmation: ""
  };
  const [form, setform] = React.useState(initialForm);

  function handleInput(e) {
    setform({ ...form, [e.target.name]: e.target.value });
  }

  function handleForm(e) {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      Axios.post(`/admin/password/change`, form)
        .then(res => {
          setform(initialForm);
          flash("success", "Password Updated Successfully");
          setIsLoading(false);
        })
        .catch(e => {
          setErrors(e.response.data.errors);
          setIsLoading(false);
        });
    }
  }

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="w-6/12 bg-white rounded-lg mt-10 p-4 flex flex-wrap justify-center">
          <h1 className="text-center text-xl w-full">Update Your password</h1>
          <form onSubmit={handleForm} className="my-2 flex flex-wrap w-10/12 ">
            <div className="w-full my-4">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="oldPassword"
                style={{ textTransform: "capitalize" }}
              >
                Old Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="oldPassword"
                type="password"
                value={form.oldPassword}
                onChange={handleInput}
                name="oldPassword"
                placeholder="oldPassword"
                required
              />
              <ErrorField name="oldPassword" errors={errors} />
            </div>
            <div className="w-full my-4">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="password"
                style={{ textTransform: "capitalize" }}
              >
                New Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="password"
                type="password"
                value={form.password}
                onChange={handleInput}
                name="password"
                placeholder="password"
                required
              />
              <ErrorField name="password" errors={errors} />
            </div>
            <div className="w-full my-4">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="password_confirmation"
                style={{ textTransform: "capitalize" }}
              >
                Confirm Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="password_confirmation"
                type="text"
                required
                value={form.password_confirmation}
                onChange={handleInput}
                name="password_confirmation"
                placeholder="password_confirmation"
              />
              <ErrorField name="password_confirmation" errors={errors} />
            </div>

            <div className="w-full my-4">
              <Submit isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Auth(Password);
