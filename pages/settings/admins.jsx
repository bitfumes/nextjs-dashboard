import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/layouts";
import Headline from "../../components/layouts/Headline";
import flash from "../../plugins/flash";
import AppContext, {
  DELETE_ADMIN,
  UPDATE_ADMIN,
  CREATE_ADMIN
} from "../../store";
import StatusSwitch from "../../components/statusSwitch";
import Modal from "../../components/Modal";
import ErrorField from "../../components/Error";
import { Auth } from "../../middlewares/auth";
import useGroupBy from "../../utilities/groupBy";
import PermissionLists from "../../components/layouts/settings/permissionLists";

function Admins(props) {
  const [{ user }, , { permitTo }] = React.useContext(AppContext);

  const [admins, setadmins] = useState(
    props.admins.filter(admin => admin.email != user.email)
  );

  const [roles, setRoles] = React.useState(props.roles);
  const [permissions, setPermissions] = React.useState(props.permissions);
  let groupedPermissions = useGroupBy(permissions, "parent");

  const [errors, setErrors] = useState({});
  const url = "/admin";
  const Initial = {
    active: false,
    email: "",
    id: "",
    name: "",
    permissions: [],
    password: "",
    password_confirmation: "",
    roles: [],
    permission_ids: [],
    role_ids: []
  };
  const [editedItem, setEditedItem] = React.useState(Initial);
  const [editedIndex, setEditedIndex] = React.useState(-1);

  const [isOpen, setIsOpen] = React.useState(false);

  function handleInput(e) {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  }

  function handleCheckbox(e) {
    if (e.target.checked) {
      setEditedItem({
        ...editedItem,
        [e.target.name]: [...editedItem[e.target.name], e.target.id]
      });
    } else {
      setEditedItem({
        ...editedItem,
        [e.target.name]: editedItem[e.target.name].filter(p => p != e.target.id)
      });
    }
  }

  React.useEffect(() => {
    updatePermissions();
  }, [editedItem.role_ids]);

  function updatePermissions() {
    let rolePermissions = [];
    editedItem.role_ids.map(role => {
      let fullRole = roles.find(r => r.id == role);
      rolePermissions.push(...fullRole.permissions);
    });

    setPermissions(
      props.permissions.filter(permission => {
        return !rolePermissions.find(rp => rp.id == permission.id);
      })
    );
  }

  function toggleActive(index) {
    const admin = admins[index];
    const method = !!admin.active == true ? "delete" : "post";
    if (confirm(`Do you want to change ${admin.name} status? `)) {
      axios[method](`admin/activation/${admin.id}`).then(res => {
        updateActive(index);
        flash("success", `You have changed the status of ${admin.name}.`);
      });
    }
  }

  function updateActive(index) {
    setadmins([
      ...admins.slice(0, index),
      { ...admins[index], active: !admins[index].active },
      ...admins.slice(index + 1)
    ]);
  }

  function submit(e) {
    e.preventDefault();
    editedIndex > -1 ? update(admins[editedIndex]) : store();
  }

  function store() {
    axios
      .post(`${url}/register`, editedItem)
      .then(res => {
        setadmins([res.data.data, ...admins]);
        flash("success", "Admin Stored Successfully");
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function update(item) {
    axios
      .patch(`${url}/${item.id}`, editedItem)
      .then(res => {
        const index = admins.indexOf(item);
        setadmins([
          ...admins.slice(0, index),
          res.data,
          ...admins.slice(index + 1)
        ]);
        flash("success", "Updated Successfully");
        setIsOpen(false);
        reset();
      })
      .catch(e => setErrors(e.response.data.errors));
  }

  function destroy(item) {
    if (confirm("Are you sure?")) {
      axios.delete(`${url}/${item.id}`).then(res => {
        const index = admins.indexOf(item);
        setadmins([...admins.slice(0, index), ...admins.slice(index + 1)]);
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
    setEditedIndex(admins.indexOf(item));
    setEditedItem({
      ...item,
      permission_ids: item.permissions.map(i => i.id),
      role_ids: item.roles.map(r => r.id)
    });
  }

  function isCheckedRole(role) {
    return !!editedItem.role_ids.filter(rol => rol == role.id).length;
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
      <div>
        <Modal show={isOpen} setIsOpen={close} submit={submit}>
          <div className="flex flex-wrap -mx-3 mb-6 px-3">
            <h1 className="text-xl float-left w-full">Admins</h1>
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
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="email"
                style={{ textTransform: "capitalize" }}
              >
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="text"
                name="email"
                value={editedItem.email}
                onChange={handleInput}
                placeholder="Email"
              />
              <ErrorField name="email" errors={errors} />
            </div>
          </div>
          {editedIndex < 0 ? (
            <div className="flex justify-between py-1">
              <div className="w-full mx-1">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                  htmlFor="password"
                  style={{ textTransform: "capitalize" }}
                >
                  Default Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="password"
                  type="text"
                  name="password"
                  value={editedItem.password}
                  onChange={handleInput}
                  placeholder="password"
                />
                <ErrorField name="password" errors={errors} />
              </div>
              <div className="w-full mx-1">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                  htmlFor="password_confirmation"
                  style={{ textTransform: "capitalize" }}
                >
                  Confirm Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={editedItem.password_confirmation}
                  onChange={handleInput}
                  placeholder="password_confirmation"
                />
                <ErrorField name="password_confirmation" errors={errors} />
              </div>
            </div>
          ) : null}

          <div className="flex justify-between pt-10">
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="name"
                style={{ textTransform: "capitalize" }}
              >
                Role
              </label>
              <div className="flex flex-wrap">
                {roles.map((role, i) => (
                  <label
                    className="inline-flex items-center w-1/4 py-2"
                    key={i}
                  >
                    <input
                      className="form-checkbox text-blue-900 my-1"
                      type="checkbox"
                      name="role_ids"
                      id={role.id}
                      checked={isCheckedRole(role)}
                      onChange={handleCheckbox}
                    />
                    <span className="ml-2 text-gray-900">{role.name}</span>
                  </label>
                ))}
              </div>
              <ErrorField name="role_ids" errors={errors} />
            </div>
          </div>
          <div className="flex justify-between pt-10">
            <div className="w-full mx-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1"
                htmlFor="name"
                style={{ textTransform: "capitalize" }}
              >
                Direct Permissions
              </label>
              <PermissionLists
                groupedPermissions={groupedPermissions}
                checkAllGroup={checkAllGroup}
                isChecked={isChecked}
                handleCheckbox={handleCheckbox}
              />
              <ErrorField name="permissions_ids" errors={errors} />
            </div>
          </div>
        </Modal>
        <Headline
          title="Admins"
          page="Admins"
          hasPermission={permitTo(CREATE_ADMIN)}
          setIsOpen={setIsOpen}
        />
        <div className="box">
          {admins.length > 0 ? (
            <>
              <table className="table w-full">
                <thead className="border">
                  <tr className="table-head">
                    <th className="py-3 border border-gray-400 font-bold">
                      Sno
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Name
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Email
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Roles
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Blogs
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Categories
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Tags
                    </th>
                    <th className="py-3 border border-gray-400 font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((item, index) => (
                    <tr
                      className={`text-center text-xs ${
                        index % 2 ? "bg-gray-100" : "bg-gray-200"
                      }`}
                      key={index}
                    >
                      <td className="py-3 border flex-1">{index + 1}</td>
                      <td className="py-3 border flex-1">
                        {!!item.active ? (
                          ""
                        ) : (
                          <i className="text-xs fas fa-ban text-orange-500 mr-1" />
                        )}
                        {item.name}
                      </td>
                      <td className="py-3 border flex-1">{item.email}</td>
                      <td className="py-3 border flex-1">
                        {item.roles.map(r => `${r.name} `)}
                      </td>
                      <td className="py-3 border flex-1">{item.blog_counts}</td>
                      <td className="py-3 border flex-1">
                        {item.category_counts}
                      </td>
                      <td className="py-3 border flex-1">{item.tag_counts}</td>
                      <td className="py-3 border flex-none">
                        {permitTo(UPDATE_ADMIN) ? (
                          <>
                            <StatusSwitch
                              item={item}
                              toggle={() => toggleActive(index)}
                            />
                            <a
                              className="cursor-pointer"
                              onClick={() => edit(item)}
                            >
                              <i className="fas fa-edit text-orange-500 ml-3" />
                            </a>
                          </>
                        ) : null}
                        {permitTo(DELETE_ADMIN) ? (
                          <a
                            className="cursor-pointer"
                            onClick={() => destroy(item)}
                          >
                            <i className="fas fa-trash text-red-500 ml-3" />
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="text-center">No Data Found</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

Admins.getInitialProps = async ctx => {
  const admins = await axios.get("/admin/all");
  const roles = await axios.get("admin/role");
  const permissions = await axios.get("admin/permission");
  return {
    admins: admins.data.data,
    roles: roles.data.data,
    permissions: permissions.data.data
  };
};
export default Auth(Admins);
