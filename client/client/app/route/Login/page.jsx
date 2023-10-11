"use client"
import React,{useState} from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FUNLogin_FAILURE, FUNLogin_REQUEST, FUNLogin_SUCCESS, Login, baseUrl } from '../../Redux/Auth/action';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const page = () => {
    
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")
  const dispatch=useDispatch()
    const handlesubmit=()=>{
        let data={
            email,password
        }
        console.log(data)
        dispatch(FUNLogin_REQUEST())
         axios.post(`${baseUrl}/user/login`,data).then((res)=>{
       console.log(res)
    toast.success("Login Succesful 🚀")
          dispatch(FUNLogin_SUCCESS())
         
        }).catch((error)=>{
         console.log(error)
         toast.error("Login failed")
         dispatch(FUNLogin_FAILURE())
       })
   }
    
  return (
    <section className="bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-yellow-100 font-orbitron">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            Flowbite    
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                </h1>
                {/* <form className="space-y-4 md:space-y-6"  onSubmit={handlesubmit}> */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" onChange={(e)=>setemail(e.target.value)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"  />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" onChange={(e)=>setpassword(e.target.value)} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                    </div>
                    <button onClick={handlesubmit}  className="w-full bg-slate-400  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  hover:bg-primary-700 focus:ring-primary-800">Sign in</button>
                    <ToastContainer autoClose={3000} />
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? <a href="/route/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                    </p>
                {/* </form> */}
            </div>
        </div>
    </div>
  </section>
  )
}

export default page