import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  // --- Part 1: Core State and API Configuration ---
  const currency = "$"; // Or 'birr' as you had in Zinit
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // CRITICAL: You must have a .env file with this
  const navigate = useNavigate();

  // --- State for Application Data ---
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // --- State for User Authentication & Authorization ---
  const [token, setToken] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // <-- ADDED: Store the full user object

  // --- State for UI (like search) ---
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mainCategory, setMainCategory] = useState("All");
  const [department, setDepartment] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [purchaseType, setPurchaseType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [ratingFilter, setRatingFilter] = useState(0);

  // --- Part 2: Asynchronous Functions (API Calls) ---

  const clearFilters = () => {
    setDepartment([]);
    setCategory([]);
    setSubCategory([]);
    setPurchaseType("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors([]);
    setSortType("relavent");
    setMainCategory("All");
    setSearch("");
    setRatingFilter(0);
  };
  // Fetches all products from the backend
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error("Could not load products.");
      }
    } catch (error) {
      toast.error("Error fetching products.");
    }
  };

  // Fetches a logged-in user's cart from the backend
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("Could not fetch user cart, may be a new user.");
    }
  };

  // Fetches a user's profile to check their seller status
  const fetchUserProfile = async (userToken) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token: userToken },
      });
      if (response.data.success) {
        setUserProfile(response.data.user); // Store the full user object
        setIsSeller(response.data.user.isSeller);
      }
    } catch (error) {
      setIsSeller(false); // Default to not a seller if check fails
    }
  };

  // --- Part 3: Cart Interaction Functions (with Backend Sync) ---

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // Optimistic UI update
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (!newCart[itemId]) newCart[itemId] = {};
      newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;
      return newCart;
    });
    // Sync with backend
    if (token) {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { token } }
      );
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    // Optimistic UI update
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId]) newCart[itemId][size] = quantity;
      return newCart;
    });
    // Sync with backend
    if (token) {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { token } }
      );
    }
  };

  // --- Part 4: Computed Values (No API calls needed) ---

  const getCartCount = () => {
    return Object.values(cartItems)
      .flatMap(Object.values)
      .reduce((sum, count) => sum + count, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          totalAmount += product.price * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  // --- Part 5: useEffect Hooks for Initialization and Session Management ---

  // Fetch all products once when the app loads
  useEffect(() => {
    getProductsData();
  }, []);

  // Load user data when the component mounts or when token changes
  useEffect(() => {
    // Define an async function inside the hook to perform startup tasks.
    async function startup() {
      // 1. Fetch the public product data immediately.
      await getProductsData();

      // 2. Check if a token exists in localStorage to restore a session.
      const userToken = localStorage.getItem("token");
      if (userToken) {
        // 3. If a token exists, set it in the state.
        setToken(userToken);

        // 4. Fetch the user-specific data associated with that token.
        await getUserCart(userToken);
        await fetchUserProfile(userToken);
      }
    }

    // Call the startup function.
    startup();
  }, []); // The empty dependency array [] ensures this runs only once on mount.

  // --- Part 6: Export all values to be used by other components ---

  const contextValue = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    mainCategory,
    setMainCategory,
    department,
    setDepartment,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    purchaseType,
    setPurchaseType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    selectedColors,
    setSelectedColors,
    sortType,
    setSortType,
    ratingFilter,
    setRatingFilter,
    clearFilters,
    isSeller,
    userProfile, // <-- EXPORT the user profile object
    fetchUserProfile,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
