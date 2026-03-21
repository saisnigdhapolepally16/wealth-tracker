export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Wealth Tracker</h1>
      <p className="text-lg mb-8 text-center text-gray-600">
        Your personal finance management tool to track income, expenses, budgets, and financial goals.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🚀 Getting Started</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Register:</strong> Create your account with name, email, and password</li>
            <li>• <strong>Login:</strong> Use your credentials to access the dashboard</li>
            <li>• <strong>Navigate:</strong> Use the navbar to switch between different sections</li>
          </ul>
        </div>

        {/* Dashboard */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">📊 Dashboard</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Quick Add:</strong> Add income or expenses directly from the dashboard</li>
            <li>• <strong>View Transactions:</strong> See all your recent financial activities</li>
            <li>• <strong>Analytics:</strong> Track your financial health at a glance</li>
          </ul>
        </div>

        {/* Income Management */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">💰 Income</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Add Income:</strong> Record salary, freelance work, or other earnings</li>
            <li>• <strong>Track Sources:</strong> Categorize different income streams</li>
            <li>• <strong>Edit/Delete:</strong> Update or remove income entries as needed</li>
          </ul>
        </div>

        {/* Expense Tracking */}
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-red-800">💸 Expenses</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Add Expenses:</strong> Log daily spending with categories</li>
            <li>• <strong>Categorize:</strong> Use categories like Food, Transport, Entertainment</li>
            <li>• <strong>Monitor Spending:</strong> Keep track of where your money goes</li>
          </ul>
        </div>

        {/* Budget Management */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">🎯 Budgets</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Set Limits:</strong> Create monthly budgets for different categories</li>
            <li>• <strong>Track Progress:</strong> See how much you've spent vs. your budget</li>
            <li>• <strong>Stay Disciplined:</strong> Avoid overspending with budget alerts</li>
          </ul>
        </div>

        {/* Goal Setting */}
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">🎯 Goals</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Set Targets:</strong> Define financial goals like vacations or savings</li>
            <li>• <strong>Progress Tracking:</strong> Visual progress bars show your advancement</li>
            <li>• <strong>Stay Motivated:</strong> Regular contributions help you reach your goals</li>
          </ul>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">💡 Pro Tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Track Regularly</h3>
            <p className="text-sm text-gray-600">Make it a habit to record transactions daily for accurate insights.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Use Categories</h3>
            <p className="text-sm text-gray-600">Consistent categorization helps you understand spending patterns.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Set Realistic Goals</h3>
            <p className="text-sm text-gray-600">Start with achievable targets and gradually increase them.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Review Monthly</h3>
            <p className="text-sm text-gray-600">Check your dashboard monthly to adjust budgets and goals.</p>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Ready to Start?</h2>
        <p className="text-gray-600 mb-4">
          Begin by adding your first income source, then track some expenses to see the magic happen!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/income'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Income
          </button>
          <button
            onClick={() => window.location.href = '/expenses'}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Track Expenses
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}