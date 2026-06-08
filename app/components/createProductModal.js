"use client";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import fetchProducts from '../admin/dashboard/page';
import { useRouter } from 'next/navigation';
import {getDecryptedItem} from '../auth/encript'


export default function CreateProductModal({ fetchProducts, show, handleClose, editProduct, isedit, setEditProduct,setLoading }) {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [previewImage,setPreviewImage] = useState('');
 
const handleAddProduct = () => {
  const loggedInUser = getDecryptedItem('user')

  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('description', document.getElementById('productDescription').value);
  formData.append('price', document.getElementById('productPrice').value);
  formData.append('itemCount', editProduct?.itemCount);
  console.log( loggedInUser,"logged")
  formData.append('userId', loggedInUser?.id || 1234); 
  console.log(loggedInUser)


  
  setLoading(true);

  const fileInput = document.getElementById('productImage');
  if (fileInput.files[0]) {
    formData.append('image', fileInput.files[0]);
  }

  if (isedit === "create") {
    // POST request (Uses FormData for the image)
    fetch('/api', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
       await  fetchProducts();
        resetForm();
        setLoading(false)
      })
      .catch((error) => console.error('Error adding product:', error));

  } else {
    // PUT request (Existing logic updated to send FormData if you want to update images)
    // If you prefer keeping your JSON logic for PUT, stick to your original code
    fetch(`/api/${editProduct._id}`, {
      method: 'PUT',
      body: formData, 
    })
      .then((response) => response.json())
      .then( async (data) => {
        await fetchProducts();
        setLoading(false)
      })
      .catch((error) => console.error('Error updating product:', error));
  }
  handleClose();

};

const resetForm = () => {
  setProductName('');
  setProductDescription('');
  setProductPrice('');
  setProductImage('');
};


  return (
    <>


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="p-3">{editProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="w-full max-w-lg p-3">
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">Product Name:</label>
              <input type="text" className="form-control" id="productName" onChange={(e) => isedit == "edit" ? setEditProduct({ ...editProduct, name: e.target.value }) : setProductName(e.target.value)} placeholder="Enter product name" value={isedit === "edit" ? editProduct.name : productName} />
            </div>
            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">Product Description:</label>
              <textarea className="form-control" id="productDescription" rows="3" onChange={(e) => isedit == "edit" ? setEditProduct({ ...editProduct, description: e.target.value }) : setProductDescription(e.target.value)} placeholder="Enter product description" value={isedit === "edit" ? editProduct.description : productDescription}></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">Product Price:</label>
              <input type="number" className="form-control" id="productPrice" onChange={(e) => isedit == "edit" ? setEditProduct({ ...editProduct, price: e.target.value }) : setProductPrice(e.target.value)} placeholder="Enter product price" value={isedit === "edit" ? editProduct.price : productPrice} />
            </div>
            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">{isedit !== "create" ?"Update Product Image" : "Product Image URL:"}</label>
              <div className='flex gap-3'>
              <input type="file" className="form-control" id="productImage" onChange={(e) => isedit == "edit" ? setEditProduct({ ...editProduct, image: URL.createObjectURL(e.target.files[0]) }) : setProductImage(URL.createObjectURL(e.target.files[0]))} placeholder="Enter product image URL" />
              <img src={editProduct?.image} width={40} height={40}/>
              </div>
              
         
            </div>
            
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-content-between gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>{isedit === "edit" ? "Update Product" : "Add Product"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
