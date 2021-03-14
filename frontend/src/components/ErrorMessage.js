import React from "react";
import { NotificationManager } from "react-notifications";

const ErrorMessage = (props) => {
  return () => {
    switch (props.type) {
      case "info":
        NotificationManager.info(props.message, props.title, 3000);
        break;
      case "success":
        NotificationManager.success(props.message, props.title, 3000);
        break;
      case "warning":
        NotificationManager.warning(props.message, props.title, 3000);
        break;
      case "error":
        NotificationManager.error(props.message, props.title, 3000);
        break;
    }
  };
};

export default ErrorMessage;
