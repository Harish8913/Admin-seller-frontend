import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, addProduct } from "../slices/productSlice";
import { logout } from "../slices/authSlice";
import axiosClient from "../api/axiosClient";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items, loading, page, totalPages, error } = useSelector((state) => state.product);
  const { token, role } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    productName: "",
    description: "",
  });
  const [brands, setBrands] = useState([
    { brandName: "", detail: "", price: "", imageFile: null },
  ]);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleBrandChange = (index, event) => {
    const nextBrands = [...brands];
    const { name, value, files } = event.target;
    nextBrands[index][name] = name === "imageFile" ? files[0] : value;
    setBrands(nextBrands);
  };

  const addBrand = () => {
    setBrands([...brands, { brandName: "", detail: "", price: "", imageFile: null }]);
  };

  const removeBrand = (index) => {
    setBrands(brands.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanBrands = brands.map((brand) => ({
      brandName: brand.brandName,
      detail: brand.detail,
      price: Number(brand.price),
      imageFile: brand.imageFile,
    }));
    await dispatch(
      addProduct({
        productName: formValues.productName,
        description: formValues.description,
        brands: cleanBrands,
      })
    );
    setFormValues({ productName: "", description: "" });
    setBrands([{ brandName: "", detail: "", price: "", imageFile: null }]);
  };

  const handleViewPDF = async (productId, productName) => {
    try {
      const response = await axiosClient.get(`/product/${productId}/pdf`, {
        responseType: "blob",
      });
      const contentType = response.headers?.["content-type"] || "application/pdf";
      const pdfBlob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      alert("Failed to view PDF: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDownloadPDF = async (productId, productName) => {
    try {
      const response = await axiosClient.get(`/product/${productId}/pdf`, {
        responseType: "blob",
      });
      const contentType = response.headers?.["content-type"] || "application/pdf";
      const pdfBlob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${productName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download PDF: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Seller Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Manage your products</h1>
            <p className="mt-2 text-sm text-slate-500">Create products, manage brands, and track your listings.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">Role: {role}</span>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_1fr]">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add Product</h2>
                <p className="mt-1 text-sm text-slate-500">Add a new product with multiple brand variants.</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Product name</label>
                  <input
                    type="text"
                    name="productName"
                    value={formValues.productName}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {brands.map((brand, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-900">Brand {index + 1}</h3>
                      {brands.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBrand(index)}
                          className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="brandName"
                        placeholder="Brand name"
                        value={brand.brandName}
                        onChange={(event) => handleBrandChange(index, event)}
                        required
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="text"
                        name="detail"
                        placeholder="Detail"
                        value={brand.detail}
                        onChange={(event) => handleBrandChange(index, event)}
                        required
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={brand.price}
                        onChange={(event) => handleBrandChange(index, event)}
                        required
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        onChange={(event) => handleBrandChange(index, event)}
                        required
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={addBrand}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add another brand
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loading ? "Saving product..." : "Save product"}
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">My Products</h2>
                <p className="mt-1 text-sm text-slate-500">View and delete your current product listings.</p>
              </div>
            </div>

            {loading && <p className="text-slate-600">Loading products...</p>}
            {!loading && items.length === 0 && <p className="text-slate-600">No products yet.</p>}

            <div className="grid gap-4">
              {items.map((product) => (
                <article key={product._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{product.productName}</h3>
                      <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleViewPDF(product._id, product.productName)}
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(product._id, product.productName)}
                        className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        Download PDF
                      </button>
                      <button
                        onClick={() => dispatch(deleteProduct(product._id))}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <p className="font-medium">Total price: ₹{product.totalPrice}</p>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-slate-900">Brands</summary>
                      <ul className="mt-3 space-y-2">
                        {product.brands.map((brand, idx) => (
                          <li key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <p className="font-semibold text-slate-900">{brand.brandName}</p>
                            <p className="text-sm text-slate-600">{brand.detail}</p>
                            <p className="mt-1 text-sm text-slate-600">Price: ₹{brand.price}</p>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(fetchProducts({ page: Math.max(page - 1, 1), limit: 10 }))}
                  disabled={page <= 1}
                  className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(fetchProducts({ page: Math.min(page + 1, totalPages), limit: 10 }))}
                  disabled={page >= totalPages}
                  className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  Next
                </button>
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
