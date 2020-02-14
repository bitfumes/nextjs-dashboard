import React from "react";

export default function Content({ children }) {
  return (
    <article className="w-5/6 m-4 h-auto min-h-screen">{children}</article>
  );
}
