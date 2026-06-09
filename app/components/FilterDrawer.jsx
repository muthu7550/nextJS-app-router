import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function FilterDrawer({ show, setFilterDrawerShow, products, setFilteredProducts}) {
  const handleClose = () => setFilterDrawerShow(false);
  const[state,setState] = useState({})

const handleSubmit = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData.entries());
  console.log(filters,"dd")
  console.log(products,"ddd")

  const filtereList = products.filter((product)=>{
    return   product.price >= filters.minprice && product.price <= filters.maxprice
  })
  console.log(filtereList,"dd")
  if(filtereList.length > 0){

    setFilteredProducts(filtereList)
  }else{
    setFilteredProducts([])
  }
  handleClose()
};

  return (
<Offcanvas show={show} onHide={handleClose} placement="end">
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Filter Products</Offcanvas.Title>
  </Offcanvas.Header>

  <div className="d-flex flex-column h-100">
    <Offcanvas.Body className="flex-grow-1 overflow-auto">

      <Form id="filterForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Min Price</Form.Label>
          <Form.Control name="minprice" type="number" />
        </Form.Group>

         <Form.Group className="mb-3">
          <Form.Label>Max Price</Form.Label>
          <Form.Control name="maxprice" type="number" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control name="startDate" type="date" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control name="endDate" type="date" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select disabled name="category">
            <option>Electronics</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Select disabled name="stock">
            <option value="">Select Stock</option>
            <option value="available">Available</option>
            <option value="not-available">Not Available</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Select disabled name="rating">
            <option>4+ Stars</option>
          </Form.Select>
        </Form.Group>
      </Form>

    </Offcanvas.Body>

    <div className="border-top p-3 d-flex justify-content-end">
      <Button type="submit" form="filterForm">
        Apply Filters
      </Button>
    </div>
  </div>
</Offcanvas>
  );
}