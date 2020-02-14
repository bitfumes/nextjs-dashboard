import { connect } from "react-redux";

const ErrorField = ({ name, errors }) => {
  if (errors[name]) {
    return <p className="text-red-500 text-xs italic">{errors[name][0]}</p>;
  }
  if (errors.error) {
    return <p className="text-red-500 text-xs italic">{errors.error}</p>;
  }
  return <p />;
};

export default ErrorField;
