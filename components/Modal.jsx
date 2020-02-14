import React from "react";

export default function Modal({ show, setIsOpen, submit, children }) {
  return show === true ? (
    <div className="container mx-auto">
      <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div className="absolute w-full h-full bg-gray-900 opacity-50 top-0 left-0 cursor-pointer" />
        <div className="z-50 bg-white md:w-2/4 sm:w-full xs:w-1 rounded-lg shadow-2xl mx-2 md:mx-0 p-4 max-h-screen overflow-y-scroll resize focus:outline-none focus:shadow-outline">
          <div className="w-full border p-4 h-full">
            <form onSubmit={submit}>
              {children}
              <div className="md:flex md:items-center">
                <div className="md:w-2/3">
                  <button
                    className="btn-create btn-create:hover btn-create:focus bg-blue-900 text-white px-4 py-1 rounded tracking-wide"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
                <div className="md:w-1/3">
                  <button
                    className="bg-white float-right text-blue-900 border border-blue-900 rounded px-4 py-1"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
