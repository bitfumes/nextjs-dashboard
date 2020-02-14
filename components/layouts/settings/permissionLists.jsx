import React from "react";

export default function PermissionLists({
  groupedPermissions,
  checkAllGroup,
  isChecked,
  handleCheckbox
}) {
  return (
    <div className="flex flex-wrap">
      {Object.keys(groupedPermissions).map(model => (
        <div key={model} className="w-full mb-5 border p-2 rounded">
          <div className="flex justify-between">
            <p>{model}</p>
            <input
              className="form-checkbox text-blue-900 my-1"
              type="checkbox"
              name={model}
              onChange={checkAllGroup}
            />
          </div>
          <div className="flex flex-wrap">
            {groupedPermissions[model].map((permission, i) => (
              <label className="inline-flex items-center w-1/4 py-2" key={i}>
                <input
                  className="form-checkbox text-blue-900 my-1"
                  type="checkbox"
                  name={permission.name}
                  id={permission.id}
                  checked={isChecked(permission)}
                  onChange={handleCheckbox}
                  placeholder="name"
                />
                <span className="ml-2 text-gray-900">{permission.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
