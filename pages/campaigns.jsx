import React from "react";
import Layout from "../components/layouts/index";
import Axios from "axios";
import Modal from "../components/Modal";
import ErrorField from "../components/Error";
import Headline from "../components/layouts/Headline";
import AppContext from "../store";
import axios from "axios";
import flash from "../plugins/flash";
import { useRouter } from "next/router";

function Campaigns({ items, meta }) {
  const [state, setState] = React.useState({ items, meta });
  const [mailinglist, setMailinglist] = React.useState([]);
  const [{ user }, , { permitTo }] = React.useContext(AppContext);

  const url = "/campaign";
  const Initial = {
    title: "",
    mailinglist_ids: [],
    body: "",
    subject: "",
    from_email: "",
    from_name: "",
    body: "",
    attachment: ""
  };

  const router = useRouter();

  const [errors, setErrors] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [editedItem, setEditedItem] = React.useState(Initial);
  const [editedIndex, setEditedIndex] = React.useState(-1);

  React.useEffect(() => {
    axios
      .get("mailinglist/all")
      .then(res => {
        setMailinglist(res.data);
        if (res.data) {
          setEditedItem({ ...editedItem, mailinglist_ids: [res.data[0].id] });
        }
      })
      .catch(e => console.log(e.response));
  }, []);

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

  function addMember(item) {
    router.push(`/members?mailinglist=${item.slug}`, `${item.slug}/members`);
  }

  return (
    <Layout>
      <div className="rounded bg-white overflow-hidden shadow-lg px-6 py-6">
        <Modal show={isOpen} setIsOpen={close} submit={submit}>
          <div className="flex flex-wrap -mx-3 mb-6 px-3">
            <h1 className="text-xl float-left w-full">Add New Campaign</h1>
          </div>

          <div className="flex justify-between py-3 flex-wrap">
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="title"
                style={{ textTransform: "capitalize" }}
              >
                Title
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="title"
                type="text"
                name="title"
                value={editedItem.title}
                onChange={handleInput}
                placeholder="title"
              />
              <ErrorField name="title" errors={errors} />
            </div>
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="mailinglist_ids"
                style={{ textTransform: "capitalize" }}
              >
                Mailing List
              </label>
              <select
                className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-4 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="mailinglist_ids"
                name="mailinglist_ids"
                defaultValue={mailinglist.length > 0 ? mailinglist[0].id : 1}
                onChange={handleInput}
              >
                {mailinglist.map((list, i) => (
                  <option value={list.id} key={i}>
                    {list.title}
                  </option>
                ))}
              </select>
              <ErrorField name="mailinglist_ids" errors={errors} />
            </div>

            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="from_name"
                style={{ textTransform: "capitalize" }}
              >
                Name From
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

            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="from_email"
                style={{ textTransform: "capitalize" }}
              >
                Email From
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
              <ErrorField name="from_email" errors={errors} />
            </div>

            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="subject"
                style={{ textTransform: "capitalize" }}
              >
                Subject
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="subject"
                type="text"
                name="subject"
                value={editedItem.subject}
                onChange={handleInput}
                placeholder="subject"
              />
              <ErrorField name="subject" errors={errors} />
            </div>

            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="body"
                style={{ textTransform: "capitalize" }}
              >
                Email Body
              </label>
              <textarea
                name="body"
                onChange={handleInput}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                rows="10"
                placeholder="Write Your Email"
                defaultValue={editedItem.body}
              />
              <ErrorField name="body" errors={errors} />
            </div>

            <div className="flex justify-between py-3">
              <div className="w-full mx-1">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                  htmlFor="publish_at"
                  style={{ textTransform: "capitalize" }}
                >
                  Schedule (optional)
                </label>
                <input
                  className="bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="publish_at"
                  type="date"
                  name="publish_at"
                  onChange={handleInput}
                  placeholder="publish_at"
                />
                <ErrorField name="publish_at" errors={errors} />
              </div>
            </div>
          </div>
        </Modal>
        <Headline
          title="Campaigns"
          page="campaigns"
          hasPermission={true}
          setIsOpen={setIsOpen}
        />
        <div className="box">
          <table className="table w-full">
            <thead className="border">
              <tr className="table-head">
                <th className="py-3 border border-gray-400 font-bold">Sno</th>
                <th className="py-3 border border-gray-400 font-bold">Title</th>
                <th className="py-3 border border-gray-400 font-bold">
                  Send Welcome Email
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
                  <td className="py-3 border flex-1">{item.title}</td>
                  <td className="py-3 border flex-1">
                    {/* {item.welcome_email ? "True" : "False"} */}
                  </td>
                  <td className="py-3 border flex-none">
                    <a
                      className="cursor-pointer"
                      onClick={() => addMember(item)}
                    >
                      <i className="fas fa-plus text-blue-500 ml-3" />
                    </a>
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

Campaigns.getInitialProps = async ctx => {
  const { data } = await Axios.get("campaign");
  return { items: data.data, meta: data.meta };
};
export default Campaigns;
