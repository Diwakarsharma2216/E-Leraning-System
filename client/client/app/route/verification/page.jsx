"use client";

import React, { useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Verification } from "../../Redux/Auth/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  const baseUrl=process.env.NEXT_PUBLIC_BASE_URL
  const otpInputs = Array.from({ length: 4 }, () => useRef(null));
  const authReducer = useSelector(
    (state) => state.authReducer
  );
  console.log(authReducer)
  const handleInputChange = (e, index) => {
    const input = e.target;
    if (input.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (index > 0) {
        otpInputs[index - 1].current?.focus();
        otpInputs[index - 1].current?.select();
      } else if (index === 0 && !otpInputs[index].current?.value) {
        otpInputs[index].current?.focus();
      }
    }
  };

 
const handleclick=()=>{

  const inputValues = otpInputs.map((ref) => ref.current?.value || "");
let collectotp=inputValues.join("")


  let verifiactiondata={
    token:authReducer.token,
    activationCode:collectotp
  }
  console.log(verifiactiondata)

  axios.post(`${baseUrl}/user/activate-User`,verifiactiondata).then((res)=>{
    console.log(res)
    toast.success("Verification Succesful")
    router.push("../../")
   }).catch((error)=>{
   toast.error("Please enter Correct otp")
  })
}

  return (
    <div className="bg-gray-900">
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden py-12">
        <div className="relative bg-slate-500 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl xs:w-5/6 xs:m-auto">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl font-orbitron text-yellow-100">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email ba**@dipainhouse.com</p>
              </div>
            </div>

            <div>
              
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                     {otpInputs.map((ref, index) =><div className="w-16 h-16" key={index}>
                      <input
                        key={index}
                        ref={ref}
                        type="number"
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      
                        name=""
                        id=""
                      />
                    </div>)}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button onClick={handleclick} className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                        Verify Account
                      </button>
                      <ToastContainer autoClose={3000} />
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-yellow-100">
                      <p>Didn't recieve code?</p>{" "}
                      <a
                        className="flex flex-row items-center text-blue-600"
                        href="http://"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resend
                      </a>
                    </div>
                  </div>
                </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
