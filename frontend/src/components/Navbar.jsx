import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div>
        <Link to="/analytics" className="mr-4 font-bold">Analytics</Link>
        <Link to="/home" className="mr-4">Guide</Link>
        <Link to="/dashboard" className="mr-4">Transactions</Link>
        <Link to="/income" className="mr-4">Income</Link>
        <Link to="/expenses" className="mr-4">Expenses</Link>
        <Link to="/budgets" className="mr-4">Budgets</Link>
        <Link to="/goals" className="mr-4">Goals</Link>
      </div>
      <button onClick={logout} className="bg-red-500 px-4 py-2">Logout</button>
    </nav>
  );
}