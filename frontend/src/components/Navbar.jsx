import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-1">
            <span className="text-2xl mr-2">💰</span>
            <span className="font-bold text-xl">WealthTracker</span>
          </div>

          <div className="hidden md:flex space-x-6">
            <Link
              to="/dashboard"
              className="hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              📊 Transactions
            </Link>
            <Link
              to="/income"
              className="hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              💰 Income
            </Link>
            <Link
              to="/expenses"
              className="hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              💸 Expenses
            </Link>
            <Link
              to="/budgets"
              className="hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              🎯 Budgets
            </Link>
            <Link
              to="/goals"
              className="hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              🏆 Goals
            </Link>
            <Link
              to="/analytics"
              className="hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              📈 Analytics
            </Link>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
          >
            🚪 Logout
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard"
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-xs font-medium transition duration-200"
            >
              📊 Transactions
            </Link>
            <Link
              to="/income"
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-xs font-medium transition duration-200"
            >
              💰 Income
            </Link>
            <Link
              to="/expenses"
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-xs font-medium transition duration-200"
            >
              💸 Expenses
            </Link>
            <Link
              to="/budgets"
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-xs font-medium transition duration-200"
            >
              🎯 Budgets
            </Link>
            <Link
              to="/goals"
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-xs font-medium transition duration-200"
            >
              🏆 Goals
            </Link>
            <Link
              to="/analytics"
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-xs font-medium transition duration-200"
            >
              📈 Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}