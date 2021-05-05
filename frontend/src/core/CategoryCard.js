import React from "react";
import { withRouter } from "react-router";
import ServeImage from "../components/ServeBackgroundImage";
import { Card } from "react-bootstrap";

const CategoryCard = ({ history, category }) => {
  return (
    <Card
      style={{
        height: 200,
        boxShadow: "0px 0px 6px 3px #f3f4f7",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() => history.push(`/product/${category._id}`, { category })}
    >
      <div style={{ height: "100%" }}>
        <ServeImage
          item={category}
          type="category"
          style={{
            height: "100%",
            backgroundSize: "contain",
            opacity: 0.5,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "xxx-large" }}>
          <span
            style={{
              color: "black",
              boxShadow: "inset 0px 0px 20px 2px #b3b3b3",
              fontWeight: "bold",
            }}
          >
            {category.name}
          </span>
        </h2>
      </div>
    </Card>
  );
};

export default withRouter(CategoryCard);
