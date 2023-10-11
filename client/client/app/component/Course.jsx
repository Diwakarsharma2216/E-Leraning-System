import Image from "next/image";
import React from "react";
import { FaBook, FaCut, FaStar } from "react-icons/fa";
const Course = () => {
  const arr = [1, 2,3];
  return (
    <div className=" bg-gray-900 h-fit">
      <div className="flex justify-center ">
        <div className=" md:w-2/4 w-3/4 mt-1 text-yellow-100">
          <h2 className="md:text-2xl text-center justify-center xs:text-xl lg:text-3xl xl:text-4xl">
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
        </div>
      </div>
      {/*  card part start here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-5/6 mx-auto  mt-3 md:gap-20 xs:gap-8">
        {arr.map((el, i) => (
          <div
            key={i}
            className="border-2 xs:w-5/6 md:w-[110%]  h-fit xs:text-lg text-xl  rounded-lg md:ml-4 mt-3 xs:mx-auto bg-zinc-700"
          >
            <Image
              src={"/courseBannerimage1.jpg"}
              alt="banner-1"
              width="400"
              height="200"
            />
            <p className="text-yellow-100 text-center font-orbitron mt-3">
              Muli-Vendor Mern Stack{" "}
            </p>
            <div className="flex justify-between">
              <StarRating rating={5} />
              <div className="mr-3">
                <p className="text-yellow-100">1233 Student</p>
              </div>
            </div>
            {/* price show */}

            <div className="flex justify-between mt-2 mb-2">
              <div className="flex mt-2">
                <span className="text-2xl text-gray-500 line-through pr-2">
                  &#x20B9;199
                </span>

                <span className="text-2xl text-green-500 pl-2">&#x20B9;99</span>
              </div>
              <div className="mr-4 flex text-base mt-2">
                <FaBook className="text-blue-500 text-xl" />
                <span className="ml-2 xs:text-sm md:text-lg text-yellow-100">
                  {40} Lectures
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export function StarRating({ rating }) {
  const stars = [...Array(rating)].map((_, index) => (
    <FaStar key={index} className="text-yellow-500 ml-1" />
  ));

  return <div className="flex ml-1">{stars}</div>;
}
export default Course;
