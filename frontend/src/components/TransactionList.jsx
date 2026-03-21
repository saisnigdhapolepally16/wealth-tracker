import { useEffect, useState } from "react";
import API from "../api";

export default function TransactionList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setData(res.data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch {
      setError("Failed to delete transaction");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {data.map((t) => (
        <div key={t._id}>
          {t.category} - ₹{t.amount}
          <button onClick={() => remove(t._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}