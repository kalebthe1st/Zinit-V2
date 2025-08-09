import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [myProducts, setMyProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyProducts = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/user/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setMyProducts(
          response.data.products.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        );
      }
    } catch (error) {
      toast.error("Failed to fetch your products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [token]);

  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/product/user/delete/${productId}`,
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchMyProducts();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("An error occurred while deleting the product.");
      }
    }
  };

  if (isLoading)
    return <p className="p-10 text-center">Loading your products...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Listed Products</h2>
      <div className="flex flex-col gap-4">
        {myProducts.length === 0 ? (
          <p className="p-10 text-center bg-gray-50 rounded-md">
            You haven't listed any products.{" "}
            <span
              onClick={() => navigate("/dashboard/add-product")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Add one now!
            </span>
          </p>
        ) : (
          myProducts.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center border p-3 rounded-lg gap-4 bg-white shadow-sm"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                {product.original_price > product.price && (
                  <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full mt-1 inline-block">
                    ON SALE
                  </span>
                )}
              </div>
              <p className="text-gray-600 font-medium text-right">
                {product.original_price > product.price && (
                  <span className="line-through text-gray-400 mr-2">
                    {currency}
                    {product.original_price}
                  </span>
                )}
                {currency}
                {product.price}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    navigate(`/dashboard/edit-product/${product._id}`)
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id, product.name)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default MyProducts;
