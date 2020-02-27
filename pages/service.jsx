import React, { useState } from "react";
import axios from "axios";
import Paginate from "../components/Paginate";
import Headline from "../components/layouts/Headline";
import Modal from "../components/Modal";
import ErrorField from "../components/Error";
import flash from "../plugins/flash";
import { Auth } from "../middlewares/auth";
import Layout from "../components/layouts";
import AppContext, {
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_CATEGORY
} from "../store";

function Service({ data }) {
  const [service, setservice] = useState(data);

  const url = "/service";
  const Initial = {
    name: "mailgun",
    domain: "",
    api_key: "",
    api_secret: "",
    from_email: "",
    from_name: "",
    user_id: 1
  };

  const [errors, setErrors] = useState({});
  const [editedItem, setEditedItem] = useState(service ? service : Initial);
  const [editedIndex, setEditedIndex] = useState(-1);

  function handleInput(e) {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  }

  function calIndex(index) {
    return state.meta.per_page * (state.meta.current_page - 1) + index + 1;
  }

  function store() {
    axios
      .post(`${url}`, editedItem)
      .then(res => {
        // setservice(res.data);
        flash("success", "Saved Successfully");
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function update(item) {
    axios
      .put(`${url}/${item.slug}`, editedItem)
      .then(res => {
        const index = state.items.indexOf(item);
        setState({
          meta: state.meta,
          items: [
            ...state.items.slice(0, index),
            res.data,
            ...state.items.slice(index + 1)
          ]
        });
        flash("success", "Updated Successfully");
        setIsOpen(false);
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  const submit = e => {
    e.preventDefault();
    editedIndex > -1 ? update(state.items[editedIndex]) : store();
  };

  return (
    <Layout>
      <div className="rounded bg-white overflow-hidden shadow-lg px-6 py-6">
        <Headline
          title="Service"
          page="service"
          hasPermission={false}
          showAdd={false}
        />
        <form className="box" onSubmit={submit}>
          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="mailinglist_id"
                style={{ textTransform: "capitalize" }}
              >
                Service Name
              </label>
              <select
                className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-4 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="name"
                name="name"
                defaultValue={editedItem.name}
                onChange={handleInput}
              >
                <option value="mailgun">Mailgun</option>
                <option value="asm">ASM (Amazon Simple Mail)</option>
              </select>
              <ErrorField name="name" errors={errors} />
            </div>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="domain"
                style={{ textTransform: "capitalize" }}
              >
                Domain Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="domain"
                type="text"
                name="domain"
                value={editedItem.domain}
                onChange={handleInput}
                placeholder="domain"
              />
              <ErrorField name="domain" errors={errors} />
            </div>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="api_key"
                style={{ textTransform: "capitalize" }}
              >
                API Key
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="api_key"
                type="text"
                name="api_key"
                value={editedItem.api_key}
                onChange={handleInput}
                placeholder="api_key"
              />
              <ErrorField name="api_key" errors={errors} />
            </div>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="api_secret"
                style={{ textTransform: "capitalize" }}
              >
                API Secret
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="api_secret"
                type="text"
                name="api_secret"
                value={
                  editedItem.api_secret == null ? "" : editedItem.api_secret
                }
                onChange={handleInput}
                placeholder="api_secret"
              />
              <ErrorField name="api_secret" errors={errors} />
            </div>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="from_name"
                style={{ textTransform: "capitalize" }}
              >
                From Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="from_name"
                type="text"
                name="from_name"
                value={editedItem.from_name}
                onChange={handleInput}
                placeholder="from_name"
              />
              <ErrorField name="from_name" errors={errors} />
            </div>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="from_email"
                style={{ textTransform: "capitalize" }}
              >
                From Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="from_email"
                type="text"
                name="from_email"
                value={editedItem.from_email}
                onChange={handleInput}
                placeholder="from_email"
              />
              <ErrorField name="api_secret" errors={errors} />
            </div>
          </div>

          <button
            className="btn-create btn-create:hover btn-create:focus bg-blue-900 text-white px-4 py-1 rounded tracking-wide"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

Service.getInitialProps = async ctx => {
  const { data } = await axios.get(`/service`);
  return data;
};

export default Auth(Service);
