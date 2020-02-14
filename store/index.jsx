import React from "react";

export const globalState = {
  loggedIn: false,
  user: {}
};

// Permissions Start
export const CREATE_ADMIN = "CreateAdmin";
export const READ_ADMIN = "ReadAdmin";
export const UPDATE_ADMIN = "UpdateAdmin";
export const DELETE_ADMIN = "DeleteAdmin";

export const CREATE_BLOG = "CreateBlog";
export const READ_BLOG = "ReadBlog";
export const UPDATE_BLOG = "UpdateBlog";
export const DELETE_BLOG = "DeleteBlog";

export const CREATE_ROLE = "CreateRole";
export const READ_ROLE = "ReadRole";
export const UPDATE_ROLE = "UpdateRole";
export const DELETE_ROLE = "DeleteRole";

export const CREATE_TAG = "CreateTag";
export const READ_TAG = "ReadTag";
export const UPDATE_TAG = "UpdateTag";
export const DELETE_TAG = "DeleteTag";

export const UPDATE_COURSE = "UpdateCourse";
export const READ_COURSE = "ReadCourse";
export const CREATE_COURSE = "CreateCourse";
export const DELETE_COURSE = "DeleteCourse";

export const CREATE_VIDEO = "CreateVideo";
export const READ_VIDEO = "ReadVideo";
export const UPDATE_VIDEO = "UpdateVideo";
export const DELETE_VIDEO = "DeleteVideo";

export const UPDATE_VIDEO_QUESTION = "CreateVideoQuestion";
export const READ_VIDEO_QUESTION = "ReadVideoQuestion";
export const CREATE_VIDEO_QUESTION = "CreateVideoQuestion";
export const DELETE_VIDEO_QUESTION = "DeleteVideoQuestion";

export const CREATE_COUPON = "CreateCoupon";
export const READ_COUPON = "ReadCoupon";
export const UPDATE_COUPON = "UpdateCoupon";
export const DELETE_COUPON = "DeleteCoupon";

export const CREATE_PLAN = "CreatePlan";
export const READ_PLAN = "ReadPlan";
export const UPDATE_PLAN = "UpdatePlan";
export const DELETE_PLAN = "DeletePlan";

export const CREATE_CATEGORY = "CreateCategory";
export const READ_CATEGORY = "ReadCategory";
export const UPDATE_CATEGORY = "UpdateCategory";
export const DELETE_CATEGORY = "DeleteCategory";

// Permissions End

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_LOGIN":
      return { ...state, ...payload };
    case "UPDATE_USER":
      return { ...state, user: payload };
    case "SET_LOGOUT":
      return { ...state, user: {}, loggedIn: false };

    default:
      return state;
  }
};

const AppContext = React.createContext();

export default AppContext;
