import React from "react";
import axios from "axios";

export default function Paginate({ pages, current_page, url, setItems }) {
  function paginate(page) {
    axios.get(`${url}?page=${page}`).then(res => setItems(res.data));
  }

  function buttons(pages) {
    let btn = [];
    for (let i = 1; i <= pages; i++) {
      btn.push(
        <button
          className={`mx-1 w-10 h-10 border border-gray3200 rounded-full shadow-xl bg-white p-1 text-sm focus:rounded-full ${
            i == current_page ? "bg-green-700 text-white" : null
          }`}
          onClick={() => paginate(i)}
          key={i}
        >
          {i}
        </button>
      );
    }
    return btn;
  }

  return (
    <div className="p-2 border mt-5 flex justify-center">{buttons(pages)}</div>
  );
}
