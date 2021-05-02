import React from "react";
import { API } from "../config";

const ServeImage = ({ item, type, style }) => {
  return (
    <div className="product-image">
      <img
        src={`${API}/${type}/photo/${item._id}`}
        style={{
          ...style,
        }}
      />
    </div>
  );
};

export default ServeImage;
