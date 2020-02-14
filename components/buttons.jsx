import React from "react";

export function Submit({ isLoading, title = "Login" }) {
  let buttonColor = isLoading
    ? "bg-gray-400 hover-bg-gray-700"
    : "bg-purple-800 hover:bg-purple-700";
  return (
    <button
      type="submit"
      className={`w-full ${buttonColor} text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
    >
      {isLoading ? (
        <span className="fas fa-circle-notch fa-spin text-xl"></span>
      ) : (
        <p className="tracking-wider">{title}</p>
      )}
    </button>
  );
}
