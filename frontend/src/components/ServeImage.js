import React from "react";
import { API } from "../config";

const ServeImage = ({ item, type, style }) => {
  return (
    <div
      className="category-image"
      style={{
        background: `url(${API}/${type}/photo/${item._id})`,
        ...style,
      }}
    ></div>
  );
};

export default ServeImage;
