import React, { useEffect, useState } from "react";
import { API } from "../config";
import { withRouter } from "react-router-dom";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Container, Row, Col } from "reactstrap";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { NotificationManager } from "react-notifications";

const ManageProducts = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const { SearchBar } = Search;

  const actionsFormatter = (cell, row) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <FaEdit
          size={20}
          fill="white"
          onClick={() => {
            history.push(`/update/product/${row._id}`, { data: row });
          }}
          style={{ cursor: "pointer" }}
        />
        <MdDelete
          size={20}
          fill="white"
          onClick={(e) => deleteProduct(e, row)}
          style={{ cursor: "pointer" }}
        />
      </div>
    );
  };

  const deleteProduct = async (e, row) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.delete(
      `${API}/product/${row._id}/${user._id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.systemMessageType === "success") {
      setUpdated(true);
      NotificationManager.success(
        `${row.name} is successfully deleted`,
        "Success",
        3000
      );
    }
  };
  const columns = [
    {
      dataField: "_id",
      text: "Product ID",
      style: function callback(cell) {
        return { color: "white" };
      },
      sort: true,
    },

    {
      dataField: "name",
      text: "Product Name",
      style: function callback(cell) {
        return { color: "white" };
      },
      sort: true,
    },
    {
      dataField: "price",
      text: "Product Price",
      style: function callback(cell) {
        return { color: "white" };
      },
      sort: true,
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: actionsFormatter,
    },
  ];

  useEffect(async () => {
    if (JSON.parse(localStorage.getItem("user")).role === 1) {
      const response = await axios.get(
        `${API}/products/shop/${JSON.parse(localStorage.getItem("shop"))._id}`
      );
      setUpdated(false);
      setProducts(response.data);
    } else {
      const response = await axios.get(`${API}/products?limit=undefined`);
      setUpdated(false);
      setProducts(response.data);
    }
  }, [updated]);

  const afterSearch = (newResult) => {
    console.log(newResult);
  };

  return (
    <Container>
      <Row>
        <Col sm={12}>
          <h1 className="product-by-category-heading">Manage Products</h1>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ToolkitProvider
            keyField="id"
            data={products}
            columns={columns}
            search={{ afterSearch }}
          >
            {(props) => {
              return (
                <div>
                  <SearchBar
                    {...props.searchProps}
                    style={{ marginBottom: 20 }}
                  />
                  <BootstrapTable {...props.baseProps} />
                </div>
              );
            }}
          </ToolkitProvider>
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ManageProducts);
