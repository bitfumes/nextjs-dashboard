import React from "react";
import Layout from "../../components/layouts/index";
import ErrorField from "../../components/Error";
import axios from "axios";
import flash from "../../plugins/flash";
import Headline from "../../components/layouts/Headline";
import AppContext, { CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE } from "../../store";
import Modal from "../../components/Modal";
import { Auth } from "../../middlewares/auth";
import PermissionLists from "../../components/layouts/settings/permissionLists";
import useGroupBy from "../../utilities/groupBy";

function RolesPermissions(props) {
  const [{ user }, , { permitTo }] = React.useContext(AppContext);
  const [errors, setErrors] = React.useState({});

  const [roles, setRoles] = React.useState(props.roles);
  const [permissions, setPermissions] = React.useState(props.permissions);
  let groupedPermissions = useGroupBy(permissions, "parent");

  const url = "/admin/role";
  const Initial = {
    name: "",
    permissions: []
  };
  const [editedItem, setEditedItem] = React.useState(Initial);
  const [editedIndex, setEditedIndex] = React.useState(-1);

  const [isOpen, setIsOpen] = React.useState(false);

  function handleInput(e) {
    setEditedItem({ ...editedItem, name: e.target.value });
  }

  function handleCheckbox(e) {
    if (e.target.checked) {
      setEditedItem({
        ...editedItem,
        permissions: [...editedItem.permissions, e.target.id]
      });
    } else {
      setEditedItem({
        ...editedItem,
        permissions: editedItem.permissions.filter(p => p != e.target.id)
      });
    }
  }

  function submit(e) {
    e.preventDefault();
    editedIndex > -1 ? update(roles[editedIndex]) : store();
  }

  function store() {
    axios
      .post(`${url}/store`, editedItem)
      .then(res => {
        setRoles([res.data, ...roles]);
        flash("success", "RolesPermissions Stored Successfully");
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function update(item) {
    axios
      .patch(`${url}/${item.id}`, editedItem)
      .then(res => {
        const index = roles.indexOf(item);
        setRoles([
          ...roles.slice(0, index),
          res.data,
          ...roles.slice(index + 1)
        ]);
        flash("success", "Updated Successfully");
        setIsOpen(false);
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function destroy(item) {
    if (item.admins_attached > 0) {
      flash("warn", "Please first detach all admins connected to this Role.");
      return;
    }
    if (confirm("Are you sure?")) {
      axios.delete(`${url}/${item.id}`).then(res => {
        const index = roles.indexOf(item);
        setRoles([...roles.slice(0, index), ...roles.slice(index + 1)]);
        flash("success", "Deleted Successfully");
      });
    }
  }

  function reset() {
    setIsOpen(false);
    setEditedIndex(-1);
    setEditedItem(Initial);
  }

  function edit(item) {
    setIsOpen(true);
    setEditedIndex(roles.indexOf(item));
    setEditedItem({ ...item, permissions: item.permissions.map(i => i.id) });
  }

  function isChecked(permission) {
    return !!editedItem.permissions.filter(per => per == permission.id).length;
  }

  function close() {
    setIsOpen(false);
    setEditedItem(Initial);
    setErrors({});
  }

  function checkAllGroup(e) {
    let permission_ids = permissions
      .filter(per => per.parent == e.target.name)
      .map(p => p.id);

    if (e.target.checked) {
      setEditedItem({
        ...editedItem,
        permissions: [...editedItem.permissions, ...permission_ids]
      });
    } else {
      setEditedItem({
        ...editedItem,
        permissions: editedItem.permissions.filter(
          p => !permission_ids.includes(p)
        )
      });
    }
  }

  return (
    <Layout>
      <div className="rounded bg-white overflow-hidden shadow-lg px-6 py-6">
        <Modal show={isOpen} setIsOpen={close} submit={submit}>
          <div className="flex flex-wrap -mx-3 mb-6 px-3">
            <h1 className="text-xl float-left w-full">Role</h1>
          </div>

          <div className="flex justify-between py-1">
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="name"
                style={{ textTransform: "capitalize" }}
              >
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="name"
                type="text"
                name="name"
                value={editedItem.name}
                onChange={handleInput}
                placeholder="name"
              />
              <ErrorField name="name" errors={errors} />
            </div>
          </div>

          <div className="flex justify-between pt-10">
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="name"
                style={{ textTransform: "capitalize" }}
              >
                Permissions
              </label>
              <PermissionLists
                groupedPermissions={groupedPermissions}
                checkAllGroup={checkAllGroup}
                isChecked={isChecked}
                handleCheckbox={handleCheckbox}
              />
              <ErrorField name="name" errors={errors} />
            </div>
          </div>
        </Modal>

        <Headline
          title="Role and Permissions"
          page="Role and Permissions"
          hasPermission={permitTo(CREATE_ROLE)}
          setIsOpen={setIsOpen}
        />
        <div className="flex justify-center">
          <table className="table w-full">
            <thead className="border">
              <tr className="table-head">
                <th className="py-3 border border-gray-400 font-bold">Sno</th>
                <th className="py-3 border border-gray-400 font-bold">Name</th>
                <th className="py-3 border border-gray-400 font-bold">
                  Admins
                </th>
                <th className="py-3 border border-gray-400 font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((item, index) => (
                <tr
                  className={`text-center text-xs ${
                    index % 2 ? "bg-gray-100" : "bg-gray-200"
                  }`}
                  key={index}
                >
                  <td className="py-3 border flex-1">{index + 1}</td>
                  <td className="py-3 border flex-1">{item.name}</td>
                  <td className="py-3 border flex-1">{item.admins_attached}</td>
                  <td className="py-3 border flex-none">
                    {permitTo(UPDATE_ROLE) ? (
                      <a className="cursor-pointer" onClick={() => edit(item)}>
                        <i className="fas fa-edit text-orange-500 ml-3" />
                      </a>
                    ) : null}
                    {permitTo(DELETE_ROLE) ? (
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
        </div>
      </div>
    </Layout>
  );
}

RolesPermissions.getInitialProps = async ctx => {
  const roles = await axios.get("admin/role");
  const permissions = await axios.get("admin/permission");
  return { roles: roles.data.data, permissions: permissions.data.data };
};
export default Auth(RolesPermissions);
