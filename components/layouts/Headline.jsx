import React from "react";

export default function Headline({ title, page, setIsOpen, showAdd = true }) {
  return (
    <div className="flex flex-wrap -mx-2 mb-6 p-2 rounded border border-gray-400">
      <div className="text-xl bg-gray-400 py-2 px-4 float-left rounded w-full">
        <div className="flex">
          <h1
            className="text-xl text-gray-700 flex-1 pt-2"
            style={{ textTransform: "capitalize" }}
          >
            {title ? title : page}
          </h1>
          {showAdd ? (
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-3 text-sm border border-white rounded shadow"
              onClick={() => setIsOpen(true)}
            >
              New
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
