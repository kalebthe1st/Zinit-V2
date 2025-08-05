import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img className="w-12 m-auto mb-5" src={assets.exchange_icon} alt="" />
        <p className="font-semibold">Trusted Product Listings</p>
        <p className="text-gray-400">
          We only showcase reliable, verified items from reputable vendors to
          ensure a seamless shopping experience.
        </p>
        {/* <p className="font-semibold">Secure Delivery</p>
        <p className="text-gray-400">
          We ensure safe and timely delivery to your doorstep
        </p> */}
      </div>
      <div>
        <img className="w-12 m-auto mb-5" src={assets.quality_icon} alt="" />
        <p className="font-semibold">Quality Assurance</p>
        <p className="text-gray-400">
          Every product is thoroughly inspected to meet our high standards
          before being made available for purchase.
        </p>
      </div>
      <div>
        <img className="w-12 m-auto mb-5" src={assets.support_img} alt="" />
        <p className="font-semibold">Best customer support</p>
        <p className="text-gray-400">we provide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
