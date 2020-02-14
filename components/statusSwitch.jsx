import React from "react";

const StatusSwitch = React.memo(({ item, toggle }) => {
  return (
    <a
      className="cursor-pointer border border-gray-400 rounded-lg p-1"
      onClick={toggle}
    >
      {!!item.active == true ? (
        <>
          <i className="text-xs fas fa-check text-green-500" />
          <i className="text-xs fas fa-arrow-right text-gray-400 mx-1" />
          <i className="text-xs fas fa-ban text-orange-500" />
        </>
      ) : (
        <>
          <i className="text-xs fas fa-ban text-orange-500" />
          <i className="text-xs fas fa-arrow-right text-gray-400 mx-1" />
          <i className="text-xs fas fa-check text-green-500" />
        </>
      )}
    </a>
  );
});

export default StatusSwitch;
