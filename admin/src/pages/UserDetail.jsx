import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, Link as RouterLink} from "react-router-dom";
import { backendUrl, currency } from "../App";

// Get the user-facing site's URL from environment variables
const frontendUrl =
  import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

const UserDetail = ({ token }) => {
  const { userId } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State Management for Filters ---
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMainCategory, setFilterMainCategory] = useState("");
  const [filterSearchTerm, setFilterSearchTerm] = useState("");

  // --- Data Fetching ---
  const fetchUserProducts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list-by-user/${userId}`,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error("Failed to fetch user's products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserProducts();
  }, [token, userId]);

  // --- Feature 1: Product Deletion Logic ---
  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the product "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        // Your backend expects a POST request with the ID in the body
        const response = await axios.post(
          `${backendUrl}/api/product/remove`,
          { id: productId },
          {
            headers: { token },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchUserProducts(); // Refresh the product list after deletion
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to delete product.");
      }
    }
  };

  // --- Feature 3: Filtering Logic ---
  // Memoize derived data for performance
  const availableCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const availableMainCategories = useMemo(
    () => [...new Set(products.map((p) => p.mainCategory))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filterCategory
        ? product.category === filterCategory
        : true;
      const matchesMainCategory = filterMainCategory
        ? product.mainCategory === filterMainCategory
        : true;
      const matchesSearch = filterSearchTerm
        ? product.name.toLowerCase().includes(filterSearchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesMainCategory && matchesSearch;
    });
  }, [products, filterCategory, filterMainCategory, filterSearchTerm]);

  if (isLoading)
    return <p className="text-center p-10">Loading user's products...</p>;

  return (
    <div>
      <RouterLink
        to="/users"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to All Users
      </RouterLink>
      <h2 className="text-2xl font-bold mb-4">Products Listed by User</h2>

      {/* --- Feature 3: Filtering Panel --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={filterSearchTerm}
          onChange={(e) => setFilterSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={filterMainCategory}
          onChange={(e) => setFilterMainCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Main Categories</option>
          {availableMainCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {products.length === 0 ? (
          <p className="p-10 text-center bg-gray-50 rounded-md">
            This user has not listed any products.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-10 text-center bg-gray-50 rounded-md">
            No products match your current filters.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg gap-4 bg-white shadow-sm"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex flex-col">
                  {/* --- Feature 4: Product Page Linking --- */}
                  <a
                    href={`${frontendUrl}/product/${product._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-lg text-indigo-700 hover:underline"
                  >
                    {product.name}
                  </a>

                  {/* --- Feature 2: Additional Product Details --- */}
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-600 mt-2">
                    <span>
                      <strong>Category:</strong> {product.category}
                    </span>
                    <span>
                      <strong>Main Category:</strong> {product.mainCategory}
                    </span>
                    <span>
                      <strong>Uploaded:</strong>{" "}
                      {new Date(product.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold text-lg">
                    {currency}
                    {product.price}
                  </p>
                  {/* --- Feature 1: Product Deletion Button --- */}
                  <button
                    onClick={() =>
                      handleDeleteProduct(product._id, product.name)
                    }
                    className="text-sm text-red-600 hover:underline mt-4"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDetail;
