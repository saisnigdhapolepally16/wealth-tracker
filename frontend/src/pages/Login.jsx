import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/analytics");
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input className="border p-2 m-1"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input className="border p-2 m-1"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-500 text-white p-2 m-1">
          Login
        </button>
      </form>

      <p className="mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500 underline">Register here</Link>
      </p>
    </div>
  );
}