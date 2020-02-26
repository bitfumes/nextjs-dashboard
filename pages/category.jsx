import React, { useState } from "react";
import axios from "axios";
import Paginate from "../components/Paginate";
import Headline from "../crud/components/Headline";
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

function Category({ items, meta }) {
  const [state, setState] = useState({ items, meta });
  const [{ user }, , { permitTo }] = React.useContext(AppContext);

  const url = "/category";
  const Initial = { name: "", theme: "" };

  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(Initial);
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
        setState({ meta: state.meta, items: [res.data, ...state.items] });
        flash("success", "Saved Successfully");
        setIsOpen(false);
        reset();
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
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function destroy(item) {
    if (confirm("Are you sure?")) {
      axios.delete(`${url}/${item.slug}`).then(res => {
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
            <h1 className="text-xl float-left w-full">Add Category</h1>
          </div>

          <div className="flex justify-between py-3">
            <div className="w-1/2 mx-1">
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

            <div className="w-1/2 mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="theme"
                style={{ textTransform: "capitalize" }}
              >
                Theme
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="theme"
                type="text"
                name="theme"
                value={editedItem.theme}
                onChange={handleInput}
                placeholder="theme"
              />
              <ErrorField name="theme" errors={errors} />
            </div>
          </div>
        </Modal>
        <Headline
          title="Categorys"
          page="Categories"
          hasPermission={permitTo(CREATE_CATEGORY)}
          setIsOpen={setIsOpen}
        />
        <div className="box">
          <table className="table w-full">
            <thead className="border">
              <tr className="table-head">
                <th className="py-3 border border-gray-400 font-bold">Sno</th>
                <th className="py-3 border border-gray-400 font-bold">Name</th>
                <th className="py-3 border border-gray-400 font-bold">
                  Blogs Count
                </th>
                <th className="py-3 border border-gray-400 font-bold">
                  Threads Count
                </th>
                <th className="py-3 border border-gray-400 font-bold">
                  Courses Count
                </th>
                <th className="py-3 border border-gray-400 font-bold">Theme</th>
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
                  <td className="py-3 border flex-1">{calIndex(index)}</td>
                  <td className="py-3 border flex-1">{item.name}</td>
                  <td className="py-3 border flex-1">{item.blogsCount}</td>
                  <td className="py-3 border flex-1">{item.threadsCount}</td>
                  <td className="py-3 border flex-1">{item.coursesCount}</td>
                  <td
                    className={`py-3 border flex-1 text-white bg-${item.theme}`}
                  >
                    {item.theme}
                  </td>
                  <td className="py-3 border flex-none">
                    {permitTo(UPDATE_CATEGORY) ? (
                      <a className="cursor-pointer" onClick={() => edit(item)}>
                        <i className="fas fa-edit text-orange-500 ml-3" />
                      </a>
                    ) : null}
                    {permitTo(DELETE_CATEGORY) ? (
                      <a
                        className="cursor-pointer"
                        onClick={() => destroy(item)}
                      >
                        <i className="fas fa-trash-alt text-red-600 ml-3" />
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginate
            setItems={resetItems}
            pages={state.meta.last_page}
            current_page={state.meta.current_page}
            url="/category"
          />
        </div>
      </div>
    </Layout>
  );
}

Category.getInitialProps = async ctx => {
  const { data } = await axios.get(`/category`);
  return { items: data.data, meta: data.meta };
};

export default Auth(Category);
