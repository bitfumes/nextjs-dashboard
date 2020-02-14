import React from "react";

export default function useOnWindowResize(setValue) {
  let [width, setWidth] = React.useState(
    process.browser ? window.innerWidth : 0
  );
  React.useEffect(() => {
    if (width > 640) {
      setValue(true);
    }
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
}
