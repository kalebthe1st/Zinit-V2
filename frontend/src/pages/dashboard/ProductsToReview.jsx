import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import ReviewModal from "../../components/dashboard/ReviewModal";

const ProductsToReview = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItemsToReview = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/review/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setItems(response.data.itemsToReview);
      }
    } catch (error) {
      toast.error("Could not fetch items to review.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsToReview();
  }, [token]);

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div>
      {selectedItem && (
        <ReviewModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onReviewSubmitted={fetchItemsToReview}
        />
      )}
      <h2 className="text-2xl font-bold mb-6">Products Awaiting Review</h2>
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <p className="p-10 text-center bg-gray-50 rounded-md">
            You have no products to review at the moment.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[auto_1fr_auto] items-center border p-4 rounded-lg gap-4 bg-white shadow-sm"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              </div>
              <button
                onClick={() => setSelectedItem(item)}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700"
              >
                Leave a Review
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ProductsToReview;
