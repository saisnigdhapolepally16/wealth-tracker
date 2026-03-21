import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (error) {
      alert(`Register failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2>Register</h2>

      <form onSubmit={submit}>
        <input className="border p-2 m-1"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input className="border p-2 m-1"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input className="border p-2 m-1"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-green-500 text-white p-2 m-1">
          Register
        </button>
      </form>

      <p className="mt-4">
        Already have an account? <Link to="/" className="text-blue-500 underline">Login here</Link>
      </p>
    </div>
  );
}