import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext"; // Use context for backendUrl

const VerifyEmail = () => {
  const { token } = useParams(); // Gets the verification token from the URL
  const { backendUrl } = useContext(ShopContext);

  // State to track the verification process: 'verifying', 'success', 'failed'
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );

  useEffect(() => {
    const verify = async () => {
      // Ensure backendUrl is available before making the call
      if (!backendUrl) return;

      try {
        // The API call to your backend verification endpoint
        const response = await axios.get(
          `${backendUrl}/api/user/verify-email/${token}`
        );

        if (response.data.success) {
          setVerificationStatus("success");
          setMessage(response.data.message);
        } else {
          setVerificationStatus("failed");
          setMessage(
            response.data.message ||
              "Verification failed. The link may be invalid or expired."
          );
        }
      } catch (error) {
        setVerificationStatus("failed");
        setMessage(
          error.response?.data?.message ||
            "An error occurred during verification."
        );
      }
    };
    verify();
  }, [token, backendUrl]); // Dependency array ensures this runs when the component mounts

  return (
    <div className="text-center m-auto my-20 p-10 max-w-lg rounded-lg shadow-lg border">
      {verificationStatus === "verifying" && (
        <div>
          <h2 className="text-2xl font-bold text-gray-700 animate-pulse">
            {message}
          </h2>
        </div>
      )}

      {verificationStatus === "success" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700">
            Verification Successful!
          </h2>
          <p className="mt-4 text-gray-700">{message}</p>
          <Link
            to="/login"
            className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800"
          >
            Proceed to Login
          </Link>
        </div>
      )}

      {verificationStatus === "failed" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700">
            Verification Failed
          </h2>
          <p className="mt-4 text-gray-700">{message}</p>
          <p className="mt-4 text-sm text-gray-500">
            Please try registering again or contact support if the problem
            persists.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
