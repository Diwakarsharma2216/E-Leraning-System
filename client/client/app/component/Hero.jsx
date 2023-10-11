import Image from "next/image";
import React from "react";
import "../utlis/hero-animation.css";
const Hero = () => {
  return (
    <div className=" bg-gray-900 mt-[1px]">
      <div className="spot" />
      <div className="spot2" />
      <div className="flex justify-center max-h-full">
        <div className="h-[600px]  md:w-2/4 w-3/4 mt-1 text-yellow-100">
          <div className="mt-[20%] ">
            <h2 className="md:text-3xl text-center xs:text-lg lg:text-4xl xl:text-5xl">
              Unleash your inner{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
                programming
              </span>{" "}
              <br />{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
                genius{" "}
              </span>{" "}
              with our community.
            </h2>

            <p className="mt-6 text-center md:text-xl xs:text-sm ">
              Empower your programming journey with Eduwakar dedicated community
              and <br />
              comprehensive resources.
            </p>

            <div className="flex justify-center items-center">
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:shadow-md transition duration-300 ease-in-out  mt-6  text-xl ">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Hero;
