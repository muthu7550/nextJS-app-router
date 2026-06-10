"use client";

import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getDecryptedItem } from "../auth/encript";

export default function CreateProductModal({
  fetchProducts,
  show,
  handleClose,
  editProduct,
  isedit,
  setEditProduct,
  setLoading,
  pageNumber,
  limit,
}) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [disable, setIsDisable] = useState(false);
 console.log(editProduct,"editProduct")
 console.log(isedit,"editProduct")


  useEffect(() => {
    if (isedit === "edit" && editProduct) {
      setProductName(editProduct.name || "");
      setProductDescription(editProduct.description || "");
      setProductPrice(editProduct.price || "");
      setPreviewImage(editProduct.image || "");
    } else {
      resetForm();
    }

  }, [editProduct, isedit,show]);
  
useEffect(() => {

  const isFormSame =
    editProduct?.name === productName &&
    editProduct?.description === productDescription &&
    editProduct?.price === productPrice &&
    editProduct?.image === previewImage;

  const isEmpty =
    !productName ||
    !productDescription ||
    !productPrice || 
     productPrice < 0 ||
    (!productImage && !previewImage);

  setIsDisable(isEmpty || isFormSame);
}, [
  productName,
  productDescription,
  productPrice,
  productImage,
  previewImage,
]);

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductImage(null);
    setPreviewImage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProductImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);

      const loggedInUser = getDecryptedItem("user");

      const formData = new FormData();

      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", productPrice);
      formData.append(
        "itemCount",
        editProduct?.itemCount || 1
      );
      formData.append(
        "userId",
        loggedInUser?.id || "1234"
      );

      if (productImage) {
        formData.append("image", productImage);
      }else{
        formData.append("existingImage", editProduct?.image);

      }
      handleClose();
        
      let response;

      if (isedit === "create") {
        response = await fetch("/api", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`/api/${editProduct._id}`, {
          method: "PUT",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      resetForm();
      await fetchProducts(pageNumber,limit);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
  handleClose();
  setEditProduct(null);
};

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="p-3">
          {isedit === "edit"
            ? "Edit Product"
            : "Add New Product"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form className="w-full max-w-lg p-3">
          <div className="mb-3">
            <label className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Product Description
            </label>
            <textarea
              rows="3"
              className="form-control"
              value={productDescription}
              onChange={(e) =>
                setProductDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Product Price
            </label>
            <input
              type="number"
              className="form-control"
              value={productPrice}
              onChange={(e) =>
                setProductPrice(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Product Image
            </label>

            <div className="d-flex gap-3 align-items-center">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />

              {previewImage && (
                <img
                  src={previewImage}
                  alt="preview"
                  width={50}
                  height={50}
                  style={{
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              )}
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={() => {
            resetForm();
          }}
        >
          Clear
        </Button>

        <Button
          variant="primary"
          onClick={handleAddProduct}
          disabled={disable}
        >
          {isedit === "edit"
            ? "Update Product"
            : "Add Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}