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
import { Modal, Button } from "react-bootstrap";

const ManageProducts = ({ history, location }) => {
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const { SearchBar } = Search;
  const [show, setShow] = useState(false);
  const [deleteBook, setDeleteBook] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          onClick={() => {
            setDeleteBook(row);
            handleShow();
            console.log(row);
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
    );
  };

  const dataFormatter = (cell, row) => {
    return row.shop.name;
  };

  const deleteProduct = async (row) => {
    const token = localStorage.getItem("token");
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
      dataField: "serial",
      text: "Serial Number",
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

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };

  if (JSON.parse(localStorage.getItem("user")).role === 2) {
    columns.insert(3, {
      dataField: "Shop Name",
      text: "Shop Name",
      formatter: dataFormatter,
      style: function callback(cell) {
        return { color: "white" };
      },
      sort: true,
    });
  }

  useEffect(async () => {
    if (JSON.parse(localStorage.getItem("user")).role === 1) {
      const response = await axios.get(
        `${API}/products/shop/${JSON.parse(localStorage.getItem("shop"))._id}`
      );
      setUpdated(false);
      response.data.map((product, index) => {
        response.data[index].serial = index + 1;
      });

      setProducts(response.data);
    } else {
      const response = await axios.get(`${API}/products?limit=undefined`);
      setUpdated(false);
      response.data.map((product, index) => {
        response.data[index].serial = index + 1;
      });
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
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Product</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: 18 }}>
              Are you sure, you want to delete{" "}
              <strong>{deleteBook && deleteBook.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                No
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  deleteProduct(deleteBook);
                  handleClose();
                }}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ManageProducts);
