import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    telebirrPhone: "", // <-- ADDED
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const url =
      currentState === "Login"
        ? `${backendUrl}/api/user/login`
        : `${backendUrl}/api/user/register`;

    try {
      const response = await axios.post(url, data);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        window.location.replace("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          name="name"
          onChange={onChangeHandler}
          value={data.name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        name="email"
        onChange={onChangeHandler}
        value={data.email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      <input
        name="password"
        onChange={onChangeHandler}
        value={data.password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      {/* --- ADDED Telebirr Phone Input for Sign Up --- */}
      {currentState === "Sign Up" && (
        <input
          name="telebirrPhone"
          onChange={onChangeHandler}
          value={data.telebirrPhone}
          type="tel"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Telebirr Phone (Optional)"
        />
      )}

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};
export default Login;
