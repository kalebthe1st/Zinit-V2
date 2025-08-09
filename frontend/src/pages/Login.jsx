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
    telebirrPhone: "",
  });

  // --- NEW STATE for showing verification message ---
  const [showVerificationMsg, setShowVerificationMsg] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setShowVerificationMsg(false); // Reset message on new submission

    const url =
      currentState === "Login"
        ? `${backendUrl}/api/user/login`
        : `${backendUrl}/api/user/register`;

    try {
      const response = await axios.post(url, data);

      if (response.data.success) {
        if (currentState === "Sign Up") {
          // On successful registration, show the verification message
          setShowVerificationMsg(true);
          toast.success(response.data.message);
        } else {
          // On successful login, set the token and redirect
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          window.location.replace("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // If verification message is shown, render it instead of the form
  if (showVerificationMsg) {
    return (
      <div className="text-center m-auto mt-20 p-10 bg-green-50 rounded-lg max-w-lg">
        <h2 className="text-2xl font-bold text-green-800">
          Registration Successful!
        </h2>
        <p className="mt-4 text-gray-700">
          A verification link has been sent to your email address:
        </p>
        <p className="font-semibold my-2">{data.email}</p>
        <p className="text-gray-700">
          Please check your inbox (and your spam folder) to complete your
          registration.
        </p>
      </div>
    );
  }

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
