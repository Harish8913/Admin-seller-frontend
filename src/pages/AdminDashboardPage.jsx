import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../api/axiosClient";
import { logout } from "../slices/authSlice";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    password: "",
    skills: "",
  });

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/admin/sellers?page=1&limit=20");
      setSellers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const payload = {
        ...form,
        skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
      };

      await axiosClient.post("/admin/seller", payload);
      setForm({
        name: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        password: "",
        skills: "",
      });
      await fetchSellers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create seller");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Manage sellers</h1>
            <p className="mt-2 text-sm text-slate-500">Create new sellers and review the current list.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">Role: {role}</span>
            <button
              onClick={() => dispatch(logout())}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Create Seller</h2>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <input name="mobile" value={form.mobile} onChange={handleChange} required placeholder="Mobile" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <input name="country" value={form.country} onChange={handleChange} required placeholder="Country" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <input name="state" value={form.state} onChange={handleChange} required placeholder="State" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </div>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              <button type="submit" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Create Seller
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Sellers</h2>
            {loading && <p className="mt-4 text-slate-600">Loading sellers...</p>}
            {!loading && sellers.length === 0 && <p className="mt-4 text-slate-600">No sellers found.</p>}
            <div className="mt-6 space-y-3">
              {sellers.map((seller) => (
                <div key={seller._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{seller.name}</p>
                  <p className="text-sm text-slate-600">{seller.email}</p>
                  <p className="text-sm text-slate-600">{seller.mobile}</p>
                  <p className="text-sm text-slate-600">{seller.country}, {seller.state}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
