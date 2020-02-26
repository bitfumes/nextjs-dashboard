import React from "react";
import { useRouter } from "next/router";
import Layout from "../components/layouts";
import Axios from "axios";
import ErrorField from "../components/Error";
import Modal from "../components/Modal";
import AppContext from "../store";
import Headline from "../components/layouts/Headline";
import flash from "../plugins/flash";

function Members({ items, meta }) {
  const [state, setState] = React.useState({ items, meta });
  const [{ user }, , { permitTo }] = React.useContext(AppContext);
  const Initial = { name: "", email: "" };
  const router = useRouter();
  const url = `${router.query.mailinglist}/member`;

  const [errors, setErrors] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [editedItem, setEditedItem] = React.useState(Initial);
  const [editedIndex, setEditedIndex] = React.useState(-1);

  function handleInput(e) {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  }

  function calIndex(index) {
    return state.meta.per_page * (state.meta.current_page - 1) + index + 1;
  }

  function store() {
    Axios.post(`${url}`, editedItem)
      .then(res => {
        setState({ meta: state.meta, items: [res.data, ...state.items] });
        flash("success", "Saved Successfully");
        setIsOpen(false);
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function update(item) {
    Axios.patch(`${url}/${item.id}`, editedItem)
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
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function destroy(item) {
    if (confirm("Are you sure?")) {
      Axios.delete(`${url}/${item.id}`).then(res => {
        const index = state.items.indexOf(item);
        setState({
          meta: state.meta,
          items: [
            ...state.items.slice(0, index),
            ...state.items.slice(index + 1)
          ]
        });
        flash("success", "Deleted Successfully");
      });
    }
  }

  function resetItems(data) {
    setState({ items: data.data, meta: data.meta });
  }

  function reset() {
    setEditedIndex(-1);
    setEditedItem(Initial);
  }

  const submit = e => {
    e.preventDefault();
    editedIndex > -1 ? update(state.items[editedIndex]) : store();
  };

  function edit(item) {
    setIsOpen(true);
    setEditedIndex(state.items.indexOf(item));
    setEditedItem(item);
  }

  function close() {
    setIsOpen(false);
    setEditedItem(Initial);
    setErrors({});
  }

  return (
    <Layout>
      <div className="rounded bg-white overflow-hidden shadow-lg px-6 py-6">
        <Modal show={isOpen} setIsOpen={close} submit={submit}>
          <div className="flex flex-wrap -mx-3 mb-6 px-3">
            <h1 className="text-xl float-left w-full">Add New List</h1>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="name"
                style={{ textTransform: "capitalize" }}
              >
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="name"
                type="text"
                name="name"
                value={editedItem.name}
                onChange={handleInput}
                placeholder="name"
              />
              <ErrorField name="name" errors={errors} />
            </div>
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="email"
                style={{ textTransform: "capitalize" }}
              >
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="text"
                name="email"
                value={editedItem.email}
                onChange={handleInput}
                placeholder="email"
              />
              <ErrorField name="email" errors={errors} />
            </div>
          </div>
        </Modal>
        <Headline
          title="Mailing Lists"
          page="mailinglist"
          hasPermission={true}
          setIsOpen={setIsOpen}
        />
        <div className="box">
          <table className="table w-full">
            <thead className="border">
              <tr className="table-head">
                <th className="py-3 border border-gray-400 font-bold">Sno</th>
                <th className="py-3 border border-gray-400 font-bold">Email</th>
                <th className="py-3 border border-gray-400 font-bold">Name</th>
                <th className="py-3 border border-gray-400 font-bold">
                  Verified
                </th>
                <th className="py-3 border border-gray-400 font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((item, index) => (
                <tr
                  className={`text-center text-xs ${
                    index % 2 ? "bg-gray-100" : "bg-gray-200"
                  }`}
                  key={index}
                >
                  <td className="py-3 border flex-1">{index + 1}</td>
                  <td className="py-3 border flex-1">{item.email}</td>
                  <td className="py-3 border flex-1">{item.name}</td>
                  <td className="py-3 border flex-1">
                    {item.email_verified_at ? "true" : "false"}
                  </td>
                  <td className="py-3 border flex-none">
                    <a className="cursor-pointer" onClick={() => edit(item)}>
                      <i className="fas fa-edit text-orange-500 ml-3" />
                    </a>
                    <a className="cursor-pointer" onClick={() => destroy(item)}>
                      <i className="fas fa-trash-alt text-red-600 ml-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <Paginate
              setItems={resetItems}
              pages={state.meta.last_page}
              current_page={state.meta.current_page}
              url="/category"
            /> */}
        </div>
      </div>
    </Layout>
  );
}

Members.getInitialProps = async ctx => {
  const { data } = await Axios.get(`${ctx.query.mailinglist}/member`);
  return { items: data, meta: {} };
};

export default Members;
