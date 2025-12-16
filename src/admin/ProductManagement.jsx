import React, { useEffect, useState } from "react";
import "./ProductManagement.css";
import { supabase } from "../utils/supabaseClient";
import { logActivity } from "../utils/logActivities";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../components/AddProducts/productSchema";
import Step1 from "../components/AddProducts/Step1";
import Step2 from "../components/AddProducts/Step2";
import Step3 from "../components/AddProducts/Step3";  


export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [step, setStep] = useState(1);

const methods = useForm({
  resolver: zodResolver(productSchema),
  defaultValues: {
    name: "",
    category: "",
    price: "",
    rating: "",
   
  },
});


  // const [formData, setFormData] = useState({
  //   name: "",
  //   category: "",
  //   price: "",
  //   image: "",
  // });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");
    if (error) {
      alert("Error fetching products: " + error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };


  const onSubmit = async (data) => {
  setLoading(true);

  const payload = {
    ...data,
    price: parseFloat(data.price),
  };

  const query = editingProduct
    ? supabase.from("products").update(payload).eq("id", editingProduct.id)
    : supabase.from("products").insert([payload]);

  const { error } = await query;

  if (error) {
    alert(error.message);
  } else {
    await logActivity(
      "product",
      editingProduct
        ? `Product '${data.name}' updated`
        : `Product '${data.name}' created`
    );

    setShowModal(false);
    setEditingProduct(null);
    methods.reset();
    fetchProducts();
  }

  setLoading(false);
};

  // Create Product
  // const handleCreate = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const { error } = await supabase.from("products").insert([
  //     {
  //       name: formData.name,
  //       category: formData.category,
  //       price: parseFloat(formData.price),
  //       image: formData.image,
  //     },
  //   ]);

  //   if (error) {
  //     alert("Error creating product: " + error.message);
  //   } else {
  //     await logActivity("product", `Product '${formData.name}' created`);
  //     alert("Product created successfully!");
  //     setShowModal(false);
  //     resetForm();
  //     fetchProducts();
  //   }
  //   setLoading(false);
  // };

  // Update Product
  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

    // const { error } = await supabase
    //   .from("products")
    //   .update({
    //     name: formData.name,
    //     category: formData.category,
    //     price: parseFloat(formData.price),
    //     image: formData.image,
    //   })
    //   .eq("id", editingProduct.id);

    // if (error) {
    //   alert("Error updating product: " + error.message);
    // } else {
    //   await logActivity("product", `Product '${formData.name}' updated`);
    //   alert("Product updated successfully!");
    //   setShowModal(false);
    //   setEditingProduct(null);
    //   resetForm();
    //   fetchProducts();
    // }
    // setLoading(false);
  //};

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      await logActivity("product", `Product "${product.name}" was deleted`);
      alert("Product deleted successfully!");
      fetchProducts();
    }
    setLoading(false);
  };

  // const resetForm = () => {
  //   setFormData({ name: "", category: "", price: "", image: "" });
  // };

  const openCreateModal = () => {
  methods.reset();      // ✅ RHF reset
  setStep(1);           // ✅ reset step
  setEditingProduct(null);
  setShowModal(true);
};

  const openEditModal = (product) => {
  methods.reset({
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.rating ?? 1,
    description: product.description ?? "",
  });
  setStep(1);
  setEditingProduct(product);
  setShowModal(true);
};


  // ... existing code ...

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategorySearch = product.category
      .toLowerCase()
      .includes(searchCategory.toLowerCase());
    const matchesCategoryFilter =
      filterCategory === "" ||
      filterCategory === "All" ||
      product.category === filterCategory;

    return matchesSearch && matchesCategorySearch && matchesCategoryFilter;
  });

  return (
    <div className="product-management">
      <div className="pm-header">
        <h2>Product Management</h2>
        <button className="btn-primary" onClick={openCreateModal}>
          + Add New Product
        </button>
      </div>

      <div className="pm-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option>All</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
          <option>Sports</option>
          <option>Cosmetics</option>
          <option>Toys</option>
          <option>Books</option>
        </select>
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="pm-table-container">
        <table className="pm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumb"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    {step === 1 && <Step1 />}
    {step === 2 && <Step2 />}
    {step === 3 && <Step3 />}

    <div className="modal-actions">
      {step > 1 && (
        <button type="button" onClick={() => setStep(step - 1)}>
          Back
        </button>
      )}

      {step < 3 && (
  <button
    type="button"
    onClick={async () => {
      let fieldsToValidate = [];

      if (step === 1) {
        fieldsToValidate = ["name", "price"];
      }

      if (step === 2) {
        fieldsToValidate = ["category", "rating"];
      }

      const valid = await methods.trigger(fieldsToValidate);

      if (valid) {
        setStep(step + 1);
      }
    }}
  >
    Next
  </button>
)}


      {step === 3 && (
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingProduct ? "Update" : "Create"}
        </button>
      )}
    </div>
  </form>
</FormProvider>

            {/* <form onSubmit={editingProduct ? handleUpdate : handleCreate}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingProduct ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form> */}
          </div>
        </div>
      )}
    </div>
  );
//}
}