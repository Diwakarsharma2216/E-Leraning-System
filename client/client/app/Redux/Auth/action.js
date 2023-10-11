
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTERE_FAILURE, REGISTERE_REQUEST, REGISTERE_SUCCESS } from "./actionType"
import axios from "axios";
export const baseUrl=process.env.NEXT_PUBLIC_BASE_URL
export const Registere = (userdata) => (dispatch)=>{
    // Complete the login functionality
   
   dispatch(FUNRegister_REQUEST())
   return axios.post(`${baseUrl}/user/registration`,userdata).then((res)=>{
  
   dispatch(FUNRegister_SUCCESS(res.data.activationToken))
    
   }).catch((Error)=>{
    console.log(Error)

    dispatch(FUNRegister_FAILURE())
  })
  };




  export const Login=(data)=>(dispatch)=>{

    dispatch(FUNLogin_REQUEST())
    return axios.post(`${baseUrl}/user/login`,data).then((res)=>{
   console.log(res)
      dispatch(FUNLogin_SUCCESS())
     
    }).catch((error)=>{
     console.log(error)
     dispatch(FUNLogin_FAILURE())
   })
  }



export const FUNRegister_REQUEST=()=>{
    return {type:REGISTERE_REQUEST}
}


export const FUNRegister_SUCCESS=(val)=>{
    return {type:REGISTERE_SUCCESS,payload:val}
}

export const FUNRegister_FAILURE=()=>{
    return {type:REGISTERE_FAILURE}
}


//  Login part here

export const FUNLogin_REQUEST=()=>{
  return {type:LOGIN_REQUEST}
}


export const FUNLogin_SUCCESS=()=>{
  return {type:LOGIN_SUCCESS}
}

export const FUNLogin_FAILURE=()=>{
  return {type:LOGIN_FAILURE}
}
