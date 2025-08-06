import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";

const MyOrders = () => {
  // This component now assumes the user is a seller.
  // We still get isSeller to ensure the correct API is called,
  // but the rendering logic will be seller-specific.
  const { token, backendUrl, currency, isSeller } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setIsLoading(true);

      try {
        // The endpoint is chosen based on the user's role.
        const endpoint = isSeller
          ? `${backendUrl}/api/order/seller-orders`
          : `${backendUrl}/api/order/user-orders`;

        const response = await axios.get(endpoint, { headers: { token } });

        if (response.data.success) {
          setOrders(
            response.data.orders.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )
          );
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch orders.");
        console.error("Fetch Orders Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, isSeller, backendUrl]);

  if (isLoading) {
    return <p className="p-10 text-center">Loading orders...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isSeller ? "Orders for Your Products" : "My Purchase History"}
      </h2>

      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <p className="p-10 text-center bg-gray-50 rounded-md">
            {isSeller
              ? "No one has ordered your products yet."
              : "You have not placed any orders."}
          </p>
        ) : (
          orders.map((order) => (
            <div
              className="border p-4 rounded-lg shadow-sm bg-white"
              key={order._id}
            >
              {/* Header Section: Contains General Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3 pb-3 border-b">
                <div>
                  <p className="font-semibold">ORDER ID</p>
                  <p className="truncate text-xs">{order._id}</p>
                </div>
                <div>
                  <p className="font-semibold">DATE</p>
                  <p>{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">TOTAL</p>
                  <p className="font-bold text-black">
                    {currency}
                    {order.amount}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">STATUS</p>
                  <p className="font-bold text-pink-600">{order.status}</p>
                </div>
              </div>

              {/* --- SELLER'S VIEW ONLY --- */}
              {/* This section now renders unconditionally, assuming this page is for sellers */}
              <div className="grid md:grid-cols-[2fr_1fr] gap-6">
                <div>
                  <p className="font-semibold mb-2">Items in this Order:</p>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 py-2 border-t first:border-t-0"
                    >
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} | Size: {item.size}
                        </p>
                      </div>
                      <p className="font-semibold ml-auto">
                        {currency}
                        {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Shipping Address</p>
                  <p className="font-medium">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>
                    {order.address.street}, {order.address.city}
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> {order.address.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.address.phone}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
